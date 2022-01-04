"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const dashboard = {
	getKiosk: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT ";
			if(req.query.dateTerm === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m/'), FLOOR((DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%d') + (DATE_FORMAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y%m%01'),'%w')-1))/7)+1) AS date, ` +
						 ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%c'), '월', FLOOR((DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%d') + (DATE_FORMAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y%m%01'),'%w')-1))/7)+1, '째주') AS data_column, `;
			}else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m') AS date, ` + 
						 ` CONCAT(DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%c'), '월') AS data_column, `;
			}
			query += ` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date, '%Y') AS data_key, ` +
					` CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS UNSIGNED INTEGER) AS cnt_sunap ` +
					` FROM ${db.sunap_daily_cnt.name} LEFT JOIN ${db.device_op_info.name} ON ${db.sunap_daily_cnt.name}.dev_id = ${db.device_op_info.name}.dev_id `;

			let where = [];

			where.push(` ${db.sunap_daily_cnt.name}.sunap_type like '%외래%' `);

			// 위치 조회 - 권한에따라 달라짐 
			if(position[1] && position[1] !== "all"){
				where.push(` ${db.device_op_info.name}.pos_1 = '${position[1]}' `);
			}

			// if(req.query.dateTerm === "weekly"){
			let from = dayjs(req.query.startDate).format("YYYY-MM-DD");
			let to = dayjs(req.query.endDate).format("YYYY-MM-DD");
			where.push(` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date,'%Y-%m-%d') BETWEEN '${from}' AND '${to}' `);
			// }

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") } `;
			}

			query += " GROUP BY date ";
			query += " ORDER BY date ";

			let result = {
				data: {},
				column: []
			};
			await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
			}).then(rows => {
				// get columns
				let column = [];
				rows.forEach(row => {
					result.data[row.dataValues.data_key] = new Array;
					column.push(row.dataValues.data_column);
				});

				// init data
				for(let key in result.data){
					for(let i = 0; i < column.length - 1; i++){
						result.data[key].push(0);
					}
				}

				// set data
				column.forEach((col, index) => {
					rows.forEach(row => {
						if(col === row.dataValues.data_column){
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
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
							` ${db.certificate_rt_log.name}.certificate_name, CAST(SUM(${db.certificate_rt_log.name}.cnt_certificate) AS UNSIGNED INTEGER) AS cnt ` + 
							` FROM ${db.certificate_rt_log.name} LEFT JOIN ${db.device_op_info.name} ON ${db.certificate_rt_log.name}.dev_id = ${db.device_op_info.name}.dev_id `;

			let where = [];

			// 위치 조회
			if(position[1] && position[1] !== "all"){
				where.push(` ${db.device_op_info.name}.pos_1 = '${position[1]}' `);
			}

			where.push(` DATE_FORMAT(${db.certificate_rt_log.name}.certificate_date , '%Y-%m-%d') BETWEEN '${req.query.startDate}' AND '${req.query.endDate}' `);

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") } `;
			}

			query += ` GROUP BY ${db.certificate_rt_log.name}.certificate_name `;

			let result = {
				data: [],
				column: []
			};
			await db.sequelize.query(query, {
				model: db.certificate_rt_log
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
		function addZero(num) {
			return ((num < 10) ? "0" : "") + num;
		}

		function secToStr(seconds){
			if(seconds < 60) {
				return "00:00:" + addZero(Math.round(seconds));
			}
			if(seconds < 3600) {
				var min = Math.floor(seconds / 60);
				var sec = Math.round(seconds - min * 60);
				return "00:" + addZero(min) + ":" + addZero(sec);
			}
			let hours = Math.floor(seconds / 3600);
			var min = Math.floor((seconds - hours * 3600) / 60);
			var sec = Math.round(seconds - hours * 3600 - min * 60);
			return addZero(hours) + ":" + addZero(min) + ":" + addZero(sec);
		}

		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let where = [];
			let subWhere = [];

			where.push(" b.workno = 1 ");
			subWhere.push(" b1.workno = 1 ");

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}else if(position[1] && position[1] !== "all"){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
				subWhere.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subWhere.push(" a1.pos_1 = a.pos_1 ");
			}
			
			let query = " SELECT " + 
			" a.pos_1 AS 'site', " +  // 기관
			" b.q_date AS 'issueDate', "; // 발행날짜

			let data_column = "";
			if(req.query.dateTerm === "weekly"){
				// 당월 조회 or 전월 조회 
				data_column = " CONCAT(DATE_FORMAT(b.q_date,'%c'), '월', WEEKOFYEAR(b.q_date) - WEEKOFYEAR(DATE_FORMAT(b.q_date,'%Y%m%01')) +1, '째주') ";
				let range = 
				" CONCAT(" + 
				"	IF(" +
				"		DATE_FORMAT(DATE_SUB(b.q_date, INTERVAL(DAYOFWEEK(b.q_date) - 2) DAY), '%m') = DATE_FORMAT(b.q_date,'%m'), " +
				"		DATE_FORMAT(DATE_SUB(b.q_date, INTERVAL(DAYOFWEEK(b.q_date) - 2) DAY), '%m.%d'), " +
				"		DATE_FORMAT(b.q_date,'%m.%01') " +
				"	), " + 
				"	'~'," +
				"	DATE_FORMAT(DATE_ADD(b.q_date, INTERVAL(7 - DAYOFWEEK(b.q_date) + 1) DAY), '%m.%d') " + 
				" ) ";

				query += data_column + " AS data_column, ";
				query += ` CONCAT(${data_column},'\n','(',${range},')') AS columns, `;
				
				subWhere.push(` DATE_FORMAT(b1.q_date, '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
				subWhere.push(` CONCAT(DATE_FORMAT(b1.q_date,'%c'), '월', WEEKOFYEAR(b1.q_date) - WEEKOFYEAR('${dayjs(req.query.startDate).set("date", 1).format("YYYY-MM-DD")}') +1, '째주' ) = data_column `);
			}else{ // "monthly"
				// 년간 조회
				data_column = " CONCAT(DATE_FORMAT(b.q_date,'%c'), '월') ";

				query += data_column + " AS data_column, ";
				query += ` CONCAT(${data_column}) AS columns, `;

				subWhere.push(` DATE_FORMAT(b1.q_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
				subWhere.push(" CONCAT(DATE_FORMAT(b1.q_date,'%c'), '월') = data_column ");
			}

			// query += dateTerm;
			// 발행건수
			// query += ` (SELECT IFNULL((  
			// 	SELECT SUM(b1.t_q_cnt)  
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
			// 	WHERE ${subWhere.join(" AND ")}
			// ), 0) as 'issueCnt') as 'issueCnt', `;

			// 평균대기시간 - sec
			query += ` (SELECT IFNULL((  
				SELECT AVG(b1.t_wtime_avg) 
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE ${subWhere.join(" AND ")}
			), 0) as 'avgSec') as 'avgSec', `;

			// 평균대기시간 - HH:mm:ss
			query += ` (SELECT IFNULL((  
				SELECT CONCAT(LPAD(ROUND((SUM(b1.t_wtime_avg) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD(SUM(b1.t_wtime_avg), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD(SUM(b1.t_wtime_avg), 60)), '2', '0')) 
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE ${subWhere.join(" AND ")}
			), 0) as 'avgTime') as 'avgTime', `;

			// 오전발행건수
			// query += ` (SELECT IFNULL((  
			// 	SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200)  
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
			// 	WHERE ${subWhere.join(" AND ")}
			// ), 0) as 'amIssueCnt') as 'amIssueCnt', `;

			// 오전대기시간 - sec
			query += ` (SELECT IFNULL((  
				SELECT AVG(b1.time_avg_1000) + AVG(b1.time_avg_1100)
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE ${subWhere.join(" AND ")}
			), 0) as 'amAvgSec') as 'amAvgSec', `;

			// 오전대기시간 - HH:mm:ss
			// query += ` (SELECT IFNULL((  
			// 	SELECT CONCAT(LPAD(ROUND(((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200)), 60)), '2', '0'))  
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
			// 	WHERE ${subWhere.join(" AND ")}
			// ), 0) as 'amWaitTime') as 'amWaitTime', `;

			// 오후발행건수
			// query += ` (SELECT IFNULL((  
			// 	SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600)  
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
			// 	WHERE ${subWhere.join(" AND ")}
			// ), 0) as 'pmIssueCnt') as 'pmIssueCnt', `;

			// 오후대기시간 - sec
			query += ` (SELECT IFNULL((  
				SELECT AVG(b1.time_avg_1400) + AVG(b1.time_avg_1500)
				FROM ${db.device_op_info.name} a1 
				INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
				WHERE ${subWhere.join(" AND ")}
			), 0) as 'pmAvgSec') as 'pmAvgSec' `;

			// // 오후대기시간 - HH:mm:ss
			// query += ` (SELECT IFNULL((  
			// 	SELECT CONCAT(LPAD(ROUND(((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600)), 60)), '2', '0'))  
			// 	FROM ${db.device_op_info.name} a1 
			// 	INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id 
			// 	WHERE ${subWhere.join(" AND ")}
			// ), 0) as 'pmWaitTime') as 'pmWaitTime'  `;

			query += ` FROM ${db.device_op_info.name} a INNER JOIN ${db.ticket_daily_cnt.name} b ON a.dev_id = b.dev_id `;

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(b.q_date, '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(b.q_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				where.push(` b.q_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") } `;
			}

			// query += " GROUP BY data_column, a.pos_1 ";
			query += " GROUP BY data_column ";
			query += " ORDER BY issueDate ";

			let result = {
				data: {
					avgTime: [],
					avgSec: [],
					avgSecToStr: [],
					amSec: [],
					pmSec: []
				},
				column: []
			};
			await db.sequelize.query(query, {
				model: db.device_op_info
			}).then(rows => {
				// get columns & data
				let avgTime, amTime, pmTime, avgSec, amSec, pmSec;
				rows.forEach(row => {
					avgTime = row.dataValues.avgTime === null ? 0 : row.dataValues.avgTime;
					avgSec = row.dataValues.avgSec === null ? 0 : row.dataValues.avgSec;
					amSec = row.dataValues.amAvgSec === null ? 0 : row.dataValues.amAvgSec;
					pmSec = row.dataValues.pmAvgSec === null ? 0 : row.dataValues.pmAvgSec;

					// result.column.push(row.dataValues.site); // 기관
					result.column.push(row.dataValues.columns); // 날짜
					result.data.avgTime.push(avgTime);
					result.data.avgSecToStr.push(secToStr(avgSec));
					result.data.avgSec.push(avgSec);
					result.data.amSec.push(amSec);
					result.data.pmSec.push(pmSec);
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
		let position = req.query.position ? req.query.position.split(",") : "";

		try {
			let query = " SELECT " + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_sunap), 0) AS UNSIGNED INTEGER) AS '수납건수', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_sunap_x), 0) AS UNSIGNED INTEGER) AS '수납불가', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_prescription), 0) AS UNSIGNED INTEGER) AS '처방전 발급 건수', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_pharm), 0) AS UNSIGNED INTEGER) AS '약국 전송 건수', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_parking_reg), 0) AS UNSIGNED INTEGER) AS '주차등록', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_parking_chg), 0) AS UNSIGNED INTEGER) AS '차량등록/변경', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_ticket), 0) AS UNSIGNED INTEGER) AS '번호표발권', ` + 
							` CAST(IFNULL(SUM(${db.sunap_daily_cnt.name}.cnt_self_eval), 0) AS UNSIGNED INTEGER) AS '진료전자기평가' ` + 
							` FROM ${db.sunap_daily_cnt.name} LEFT JOIN ${db.device_op_info.name} ON ${db.sunap_daily_cnt.name}.dev_id = ${db.device_op_info.name}.dev_id `;

			let where = [];

			// 위치 조회
			if(position[1] && position[1] !== "all"){
				where.push(` ${db.device_op_info.name}.pos_1 = '${position[1]}' `);
			}
				
			where.push(` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date , '%Y-%m-%d') BETWEEN '${req.query.startDate}' AND '${req.query.endDate}' `);
				
			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") } `;
			}

			let result = {
				data: [],
				column: []
			};
			await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
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
