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
							// " WHERE " +
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
			const query = " SELECT " + 
							` ${db.device_op_info.name}.pos_1 AS pos1, ` + 
							` CAST((
								SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
							  ) AS UNSIGNED INTEGER) AS am, ` + 
							` CAST((
								SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
							  ) AS UNSIGNED INTEGER) AS pm, ` + 
							` (
								SELECT SUM(b1.t_wtime_avg)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE  a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
							  ) AS avgtime ` +
							` FROM ${db.device_op_info.name} INNER JOIN ${db.ticket_daily_cnt.name} ON ${db.device_op_info.name}.dev_id = ${db.ticket_daily_cnt.name}.dev_id ` +
							` WHERE ${db.ticket_daily_cnt.name}.workno = 1 ` +
							` GROUP BY ${db.device_op_info.name}.pos_1 `;
	
			let result = {
				data: {
					am: [],
					pm: [],
					avgtime: []
				},
				column: []
			};
			await db.sequelize.query(query, {
				model: db.device_op_info
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns & data
				let am, pm, avgtime;
				rows.forEach(row => {
					am = row.dataValues.am === null ? 0 : row.dataValues.am;
					pm = row.dataValues.pm === null ? 0 : row.dataValues.pm;
					avgtime = row.dataValues.avgtime === null ? 0 : row.dataValues.avgtime;

					result.column.push(row.dataValues.pos1);
					result.data.am.push(am);
					result.data.pm.push(pm);
					result.data.avgtime.push(avgtime);
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
							` ${db.sunap_daily_cnt.name}.sunap_type, CAST(SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS UNSIGNED INTEGER) AS cnt ` + 
							` FROM ${db.sunap_daily_cnt.name} ` +
							// " WHERE " +
							` GROUP BY ${db.sunap_daily_cnt.name}.sunap_type `;
			
			let result = {
				data: [],
				column: []
			};
			await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
				//replacements: { pat_no: req.query.PAT_NO }
			}).then(rows => {
				// get columns & data
				rows.forEach(row => {
					result.column.push(row.dataValues.sunap_type);
					result.data.push({
						value: row.dataValues.cnt,
						name: row.dataValues.sunap_type
					});
				});
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
