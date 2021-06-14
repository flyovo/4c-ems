"use strict";
const db = require("../models");
const { Op } = require("sequelize");

const dashboard = {
	getKiosk: async function (req, res, next) {
		try {
			const query = " SELECT " + 
							` DATE_FORMAT(DATE_SUB(${db.sunap_daily_cnt.name}.sunap_date, INTERVAL (DAYOFWEEK(${db.sunap_daily_cnt.name}.sunap_date)-1) DAY), '%Y/%m/%d') AS start, ` + 
							` DATE_FORMAT(DATE_SUB(${db.sunap_daily_cnt.name}.sunap_date, INTERVAL (DAYOFWEEK(${db.sunap_daily_cnt.name}.sunap_date)-7) DAY), '%Y/%m/%d') AS end, ` + 
							` DATE_FORMAT(${db.sunap_daily_cnt.name}.sunap_date, '%Y%U') AS date, ` + 
							` SUM(${db.sunap_daily_cnt.name}.cnt_sunap) AS cnt_sunap ` +
							` FROM ${db.sunap_daily_cnt.name} LEFT JOIN ${db.device_op_info.name} ON ${db.sunap_daily_cnt.name}.dev_id = ${db.device_op_info.name}.dev_id ` +
							" WHERE " +
							` ${db.sunap_daily_cnt.name}.sunap_type like '%외래%' ` + 
			//권한에따라 달라짐
			//` AND ${db.device_op_info.name}.pos_1 = '본관' ` + 
			// 당월 조회 
			//` AND date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y-%m') = '2021-06' ` +
			// 전월 조회 
			//` AND date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y-%m') = '2021-05' ` + 
			// 년간 조회
						    ` AND date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y') = '2021' ` + 
							" GROUP BY date ";
	
			const result = await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
				//replacements: { pat_no: req.params.PAT_NO }
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
			const query = " SELECT certificate_name, SUM(cnt_certificate) " + 
							` FROM ${db.certificate_rt_log.name} ` +
			//				" WHERE " +
			//권한에따라 달라짐
			//` AND ${db.certificate_rt_log.name}.pos_1 = '본관' ` + 
			// 당월 조회 
			//` AND date_format(${db.certificate_rt_log.name}.sunap_date, '%Y-%m') = '2021-06' ` +
			// 전월 조회 
			//` AND date_format(${db.certificate_rt_log.name}.sunap_date, '%Y-%m') = '2021-05' ` + 
			// 년간 조회
						    //` AND date_format(${db.certificate_rt_log.name}.sunap_date, '%Y') = '2021' ` + 
							" GROUP BY certificate_name ";

			const result = await db.sequelize.query(query, {
				model: db.certificate_rt_log
				//replacements: { pat_no: req.params.PAT_NO }
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
							` (
								SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
								) AS am, ` + 
							` (
								SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
								) AS pm, ` + 
							` (
								SELECT SUM(b1.t_wtime_avg)
								FROM ${db.device_op_info.name} a1 
								INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id
								WHERE  a1.pos_1 = pos1 AND b1.workno = 1 AND b1.q_date = CURDATE() - INTERVAL 1 DAY
								) AS avgtime ` +
							` FROM ${db.device_op_info.name} INNER JOIN ${db.ticket_daily_cnt.name} ON ${db.device_op_info.name}.dev_id = ${db.ticket_daily_cnt.name}.dev_id ` +
							` WHERE ${db.ticket_daily_cnt.name}.workno = 1 ` +
			// 당월 조회 
			//` AND date_format(${db.device_op_info.name}.sunap_date, '%Y-%m') = '2021-06' ` +
			// 전월 조회 
			//` AND date_format(${db.device_op_info.name}.sunap_date, '%Y-%m') = '2021-05' ` + 
			// 년간 조회
							//` AND date_format(${db.device_op_info.name}.sunap_date, '%Y') = '2021' ` + 
							` GROUP BY ${db.device_op_info.name}.pos_1 `;
	
			const result = await db.sequelize.query(query, {
				model: db.device_op_info
				//replacements: { pat_no: req.params.PAT_NO }
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getStatus: async function (req, res, next) {
		try {
			const query = " SELECT sunap_type, SUM(cnt_sunap) " + 
							` FROM ${db.sunap_daily_cnt.name}  ` +
							" WHERE " +
			//권한에따라 달라짐
			//` AND ${db.device_op_info.name}.pos_1 = '본관' ` + 
			// 당월 조회 
			//` AND date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y-%m') = '2021-06' ` +
			// 전월 조회 
			//` AND date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y-%m') = '2021-05' ` + 
			// 년간 조회
						    ` date_format(${db.sunap_daily_cnt.name}.sunap_date, '%Y') = '2021' ` + 
							" GROUP BY sunap_type ";
	
			const result = await db.sequelize.query(query, {
				model: db.sunap_daily_cnt
				//replacements: { pat_no: req.params.PAT_NO }
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
