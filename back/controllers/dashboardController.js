"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const dashboard = {
	getKiosk: async function (req, res, next) {
		try {
			let query = " SELECT ";
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				// query += ` DATE_FORMAT(DATE_SUB(${db.sunap_daily_cnt.name}.sunap_date, INTERVAL (DAYOFWEEK(${db.sunap_daily_cnt.name}.sunap_date)-1) DAY), '%Y/%m/%d') AS start, `;
				// query += ` DATE_FORMAT(DATE_SUB(${db.sunap_daily_cnt.name}.sunap_date, INTERVAL (DAYOFWEEK(${db.sunap_daily_cnt.name}.sunap_date)-7) DAY), '%Y/%m/%d') AS end, `;
				query += ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m/'), FLOOR((DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%d') + (DATE_FORMAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y%m%01'),'%w')-1))/7)+1) AS date, ` +
						 ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%c'), '월', FLOOR((DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%d') + (DATE_FORMAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y%m%01'),'%w')-1))/7)+1, '째주') AS data_cloumn, `;
			}else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m') AS date, ` + 
						 ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%c'), '월') AS data_cloumn, `;
			}
			query += ` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date, '%Y') AS data_key, ` +
					` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS UNSIGNED INTEGER) AS cnt_sunap ` +
					` FROM ${db.sunap_daily_cnt.name} LEFT JOIN ${db.device_op_info.name} ON ${db.sunap_daily_cnt.name}.dev_id = ${db.device_op_info.name}.dev_id ` +
					" WHERE " +
					` ${db.sunap_daily_cnt.name}.sunap_type like '%외래%' ` + 
					//권한에따라 달라짐
					` AND ${db.device_op_info.name}.pos_1 = '본관' `;

			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				let from = dayjs(req.query.from).subtract(1, "year").format("YYYY-MM");
				let to = dayjs(req.query.to).format("YYYY-MM");
				query += ` AND DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m') IN ('${from}', '${to}') `;
			}else{ // "monthly"
				// 년간 조회
				// query += ` AND DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y') IN ('2020', '2021') `;
				query += ` AND DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}' `;
			}
			query += " GROUP BY date";
			let result = {
				data: {},
				column: []
			};
			await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns
				let column = [];
				rows.forEach(row => {
					result.data[row.dataValues.data_key] = new Array;
					column.push(row.dataValues.data_cloumn);
				});
				column = [...new Set(column)];
				column.sort();

				// init data
				for(let key in result.data){
					for(let i = 0; i < column.length - 1; i++){
						result.data[key].push(0);
					}
				}

				// set data
				column.forEach((col, index) => {
					rows.forEach(row => {
						// row.start;
						// row.end;
						if(col === row.dataValues.data_cloumn){
							result.data[row.dataValues.data_key][index] = row.dataValues.cnt_sunap;
						}
					});
				});
				result.column = column;
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getCertificate: async function (req, res, next) {
		try {
			const query = " SELECT " + 
							` ${db.certificate_rt_log.name}.certificate_name, CAST(SUM(${db.certificate_rt_log.name}.cnt_certificate) AS UNSIGNED INTEGER) AS cnt ` + 
							` FROM ${db.certificate_rt_log.name} ` +
							" WHERE " +
							` DATE_FORMAT(${db.certificate_rt_log.name}.certificate_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}' ` +
							` GROUP BY ${db.certificate_rt_log.name}.certificate_name `;

			let result = {
				data: [],
				column: []
			};
			await db.sequelize.query(query, {
				model: db.certificate_rt_log
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns & data
				rows.forEach(row => {
					result.column.push(row.dataValues.certificate_name);
					result.data.push(row.dataValues.cnt);
				});
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getWait: async function (req, res, next) {
		try {
			// req.query.to = "2021-07-14";
			let query = " SELECT " + 
			// 기관
			` ${db.device_op_info.name}.pos_1 AS pos1, ` + 
			// 발행날짜
			` ${db.ticket_daily_cnt.name}.q_date AS q_date, `;

			// 발행건수
			query += ` (SELECT IFNULL((  
				SELECT SUM(b1.t_q_cnt)  
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) AS issueCnt) AS issueCnt, `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 

			// 평균대기시간
			query += ` (SELECT IFNULL((  
				SELECT CONCAT(LPAD(ROUND((SUM(b1.t_wtime_avg) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD(SUM(b1.t_wtime_avg), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD(SUM(b1.t_wtime_avg), 60)), '2', '0')) 
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) AS avgTime) AS avgTime, `; 
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 

			// 평균대기시간 총합
			query += ` (SELECT IFNULL((  
				SELECT SUM(b1.t_wtime_avg)
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) AS avgTimeTotal) AS avgTimeTotal, `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 
			// ` (
			// 	SELECT SUM(b1.t_wtime_avg)
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
			// 	WHERE  a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
			//   ) AS avgtime, ` + 

			// 오전발행건수
			query += ` (SELECT IFNULL((  
				SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200)  
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) AS amIssueCnt) AS amIssueCnt, `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 

			// 오전대기시간
			query += ` (SELECT IFNULL((  
				SELECT CONCAT(LPAD(ROUND(((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)), 60)), '2', '0'))  
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) AS amWaitTime) AS amWaitTime, `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 

			// ` CAST((
			// 	SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200)
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
			// 	WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
			//   ) AS UNSIGNED INTEGER) AS am, ` + 

			// 오후발행건수
			query += ` (SELECT IFNULL((  
				SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600)  
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) as pmIssueCnt) as pmIssueCnt, `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 

			// 오후대기시간
			query += ` (SELECT IFNULL((  
				SELECT CONCAT(LPAD(ROUND(((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)), 60)), '2', '0'))  
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE b1.workno = 1 
				AND a1.pos_1 = ${db.device_op_info.name}.pos_1
				AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}'
			), 0) as pmWaitTime) as pmWaitTime `;
			// AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' 
				
			// ` CAST((
			// 	SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600)
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
			// 	WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
			//   ) AS UNSIGNED INTEGER) AS pm ` + 

			query += ` FROM ${db.device_op_info.name} INNER JOIN ${db.ticket_daily_cnt.name} ON ${db.device_op_info.name}.dev_id = ${db.ticket_daily_cnt.name}.dev_id ` +
					 ` WHERE ${db.ticket_daily_cnt.name}.workno = 1 ` ;
			// ` AND ${db.device_op_info.name}.site = '세브란스(신촌)' ` + 
			if(true){
				// -- 기간 선택
				// -- 전체 날짜일 경우 사용 안함
				// query += ` AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date, '%Y-%m-%d') = '${req.query.to}' `;
				query += ` AND DATE_FORMAT(${db.ticket_daily_cnt.name}.q_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}' `;
				query += ` GROUP BY ${db.device_op_info.name}.pos_1 `;

			}else{
				// -- 일일 조회 사용하지 않을 경우엔
				query += ` GROUP BY ${db.device_op_info.name}.pos_1, DATE_FORMAT(${db.device_op_info.name}.q_date , '%Y-%m-%d') `;
			}

			let result = {
				data: {
					am: [],
					pm: [],
					avgTime: [],
					avgTimeTotal: []
				},
				column: []
			};
			await db.sequelize.query(query, {
				model: db.device_op_info
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns & data
				let am, pm, avgTime, avgTimeTotal;
				rows.forEach(row => {
					am = row.dataValues.amIssueCnt === null ? 0 : row.dataValues.amIssueCnt;
					pm = row.dataValues.pmIssueCnt === null ? 0 : row.dataValues.pmIssueCnt;
					avgTime = row.dataValues.avgTime === null ? 0 : row.dataValues.avgTime;
					avgTimeTotal = row.dataValues.avgTimeTotal === null ? 0 : row.dataValues.avgTimeTotal;
					
					result.column.push(row.dataValues.pos1);
					result.data.am.push(am);
					result.data.pm.push(pm);
					result.data.avgTime.push(avgTime);
					result.data.avgTimeTotal.push(avgTimeTotal);
				});
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getMenuUse: async function (req, res, next) {
		try {
			const query = " SELECT " + 
							// ` ${db.sunap_daily_cnt.name}.sunap_type, CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS UNSIGNED INTEGER) AS cnt ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS UNSIGNED INTEGER) AS '수납건수', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap_x) AS UNSIGNED INTEGER) AS '수납불가', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_prescription) AS UNSIGNED INTEGER) AS '처방전 발급 건수', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_pharm) AS UNSIGNED INTEGER) AS '약국 전송 건수', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_parking_reg) AS UNSIGNED INTEGER) AS '주차등록', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_parking_chg) AS UNSIGNED INTEGER) AS '차량등록/변경', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_ticket) AS UNSIGNED INTEGER) AS '번호표발권', ` + 
							` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_self_eval) AS UNSIGNED INTEGER) AS '진료전자기평가' ` + 
							` FROM ${db.sunap_daily_cnt.name} ` +
							" WHERE " +
							` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date , '%Y-%m-%d') BETWEEN '${req.query.from}' AND '${req.query.to}' `;
			let result = {
				data: [],
				column: []
			};
			await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns & data
				let keys = [];
				const value = [];
				rows.forEach(row => {
					keys = Object.keys(row.dataValues);
					for (let i = 0; i < keys.length; i++) {
						const key = keys[i]; // 각각의 키
						value[i] = {
							value: row.dataValues[key],
							name: key
						};
					}
				});
				result.data = value;
				result.column = keys;
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	}
};
module.exports = dashboard;
