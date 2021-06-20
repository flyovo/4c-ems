"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const statistics = {
	getOutPatient: async function (req, res, next) {
		try {
			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.op_prog AS '용도' " + 
			" , " + 
			" ( " + 
			"  SELECT COUNT(DISTINCT a1.dev_id) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.sunap_type LIKE '%외래%' " + 
			" ) AS `대수` " + 
			" , CAST(SUM(b.cnt_sunap) AS UNSIGNED INTEGER) AS '건수' " + 
			" , CAST(SUM(b.amount) AS UNSIGNED INTEGER) AS '금액' " + 
			" , CAST(SUM(b.cnt_sunap_x) AS UNSIGNED INTEGER) AS '불능건수' " + 
			" , CAST(SUM(b.cnt_his_query) AS UNSIGNED INTEGER) AS 'HIS 조회' " + 
			" , CAST(SUM(b.cnt_prescription) AS UNSIGNED INTEGER) AS '처방전 발행' " + 
			" , CAST(SUM(b.cnt_pharm) AS UNSIGNED INTEGER) AS '약국 전송' " + 
			" , CAST(SUM(b.cnt_parking_reg) AS UNSIGNED INTEGER) AS '주차등록' " + 
			" , CAST(SUM(b.cnt_parking_chg) AS UNSIGNED INTEGER) AS '차량등록/변경' " + 
			" , CAST(SUM(b.cnt_self_eval) AS UNSIGNED INTEGER) AS '진료전자기평가' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` +
			" WHERE ";
			// " b.sunap_type LIKE '%외래%' " + 
			// " AND a.site = '신촌세브란스' " + 
			// AND a.pos_1 = '본관'	// 세부 정보 선택했을 경우
			// AND a.pos_2 = '1층'	// 세부 정보 선택했을 경우
			// AND a.pos_3 = '응급실'	// 세부 정보 선택했을 경우

			let to = dayjs(req.query.to);
			// query += " AND ";
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` DATE_FORMAT(b.sunap_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			}else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(b.sunap_date, '%Y')= '${to.format("YYYY")}' `;
			}
		 
			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3, a.op_prog " + 
					 " ORDER BY a.pos_1, a.pos_2, a.pos_3, a.op_prog ";

			let result = await db.sequelize.query(query, {
				model: db.device_op_info
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getInPatient: async function (req, res, next) {
		try {
			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND b1.sunap_type LIKE '%중간%' " + 
			" ) AS UNSIGNED INTEGER) AS '중간건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND b1.sunap_type LIKE '%중간%' " + 
			" ) AS UNSIGNED INTEGER) AS '중간금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND b1.sunap_type LIKE '%퇴원%' " + 
			" ) AS UNSIGNED INTEGER) AS '퇴원건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND b1.sunap_type LIKE '%퇴원%' " + 
			" ) AS UNSIGNED INTEGER) AS '퇴원금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_his_query), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND (b1.sunap_type LIKE '%퇴원%' OR b1.sunap_type LIKE '%중간%') " + 
			" ) AS UNSIGNED INTEGER) AS '입퇴원비조회건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap_x), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND (b1.sunap_type LIKE '%퇴원%' OR b1.sunap_type LIKE '%중간%') " + 
			" ) AS UNSIGNED INTEGER) AS '입퇴원비불능건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_parking_reg), 0) AS UNSIGNED INTEGER) AS '주차등록건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_parking_chg), 0) AS UNSIGNED INTEGER) AS '주차변경건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_ins), 0) AS UNSIGNED INTEGER) AS '보호자밥신청건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_chg), 0) AS UNSIGNED INTEGER) AS '보호자밥변경건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_can), 0) AS UNSIGNED INTEGER) AS '보호자밥취소건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_inq), 0) AS UNSIGNED INTEGER) AS '보호자밥조회건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_op_guide), 0) AS UNSIGNED INTEGER) AS '수술진행안내건수' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE ";
			// " a.site = '신촌세브란스' " + 
			// " AND a.pos_1 = '본관' " + // 세부 정보 선택했을 경우
			// " AND a.pos_2 = '1층' " + // 세부 정보 선택했을 경우
			// " AND a.pos_3 = '응급실' " + // 세부 정보 선택했을 경우

			let to = dayjs(req.query.to);
			// query += " AND ";
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` DATE_FORMAT(b.sunap_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			}else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(b.sunap_date, '%Y')= '${to.format("YYYY")}' `;
			}
			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3 ";

			let result = await db.sequelize.query(query, {
				model: db.device_op_info
				//replacements: { pat_no: req.query.PAT_NO }
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getCertification: async function (req, res, next) {
		try {
			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_01), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입퇴원증명서' " + 
			" ) AS UNSIGNED INTEGER) AS '입퇴원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_02), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '통원증명서' " + 
			" ) AS UNSIGNED INTEGER) AS '통원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_03), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '납입증명서' " + 
			" ) AS UNSIGNED INTEGER) AS '납입증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_04), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '장애인증명서' " + 
			" ) AS UNSIGNED INTEGER) AS '장애인증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_05), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입원영수증' " + 
			" ) AS UNSIGNED INTEGER) AS '입원영수증' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_06), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '외래진료비' " + 
			" ) AS UNSIGNED INTEGER) AS '외래진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_07), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '응급진료비' " + 
			" ) AS UNSIGNED INTEGER) AS '응급진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.cnt_01) + SUM(b1.cnt_02) + SUM(b1.cnt_03) + SUM(b1.cnt_04) + SUM(b1.cnt_05) + SUM(b1.cnt_06) + SUM(b1.cnt_07) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '계' " + 
			" ) AS UNSIGNED INTEGER) AS '계' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.certificate_daily_cnt.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE ";
			// query += " a.site = '신촌세브란스' " + 
		 	// " AND a.pos_1 = '본관' " + // 세부 정보 선택했을 경우
		 	// " AND a.pos_2 = '1층' " + // 세부 정보 선택했을 경우
		 	// " AND a.pos_3 = '응급실' " + // 세부 정보 선택했을 경우
		 
			 let to = dayjs(req.query.to);
			 // query += " AND ";
			 if(req.query.term === "weekly"){
				 // 당월 조회 or 전월 조회 
				 query += ` DATE_FORMAT(b.certificate_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			 }else{ // "monthly"
				 // 년간 조회
				 query += ` DATE_FORMAT(b.certificate_date, '%Y')= '${to.format("YYYY")}' `;
			 }

			 query += " GROUP BY a.pos_1, a.pos_2, a.pos_3 ";


			let result = await db.sequelize.query(query, {
				model: db.device_op_info
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getWeek: async function (req, res, next) {
		try {
			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT count(DISTINCT a1.dev_id) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' " + 
			" ) AS UNSIGNED INTEGER) AS '대수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 2 " + 
			" ) AS UNSIGNED INTEGER) AS '월건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 2 " + 
			" ) AS UNSIGNED INTEGER) AS '월금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 3 " + 
			" ) AS UNSIGNED INTEGER) AS '화건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 3 " + 
			" ) AS UNSIGNED INTEGER) AS '화금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 4 " + 
			" ) AS UNSIGNED INTEGER) AS '수건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 4 " + 
			" ) AS UNSIGNED INTEGER) AS '수금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 5 " + 
			" ) AS UNSIGNED INTEGER) AS '목건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 5 " + 
			" ) AS UNSIGNED INTEGER) AS '목금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 6 " + 
			" ) AS UNSIGNED INTEGER) AS '금건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 6 " + 
			" ) AS UNSIGNED INTEGER) AS '금금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 7 " + 
			" ) AS UNSIGNED INTEGER) AS '토건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 7 " + 
			" ) AS UNSIGNED INTEGER) AS '토금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 1 " + 
			" ) AS UNSIGNED INTEGER) AS '일건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"  WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 1 " + 
			" ) AS UNSIGNED INTEGER) AS '일금액' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE ";
			// " a.site = '신촌세브란스' " +
			// AND a.pos_1 = '본관'	// 세부 정보 선택했을 경우
			// AND a.pos_2 = '1층'	// 세부 정보 선택했을 경우
			// AND a.pos_3 = '응급실'	// 세부 정보 선택했을 경우
		
			// AND b.sunap_type like '%외래%' // 외래수납 선택했을 경우
			// AND b.sunap_type like '%중간%' // 중간금수납 선택했을 경우
			// AND b.sunap_type like '%퇴원%' // 퇴원수납 선택했을 경우
			// 전체 수납을 선택했을 경우엔 위 조건 사용 안함
		
			let to = dayjs(req.query.to);
			 // query += " AND ";
			 if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` DATE_FORMAT(b.sunap_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			 }else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(b.sunap_date, '%Y')= '${to.format("YYYY")}' `;
			 }
		
			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3 ";
			query += " ORDER BY a.pos_1, a.pos_2, a.pos_3 ";
			
			let result = await db.sequelize.query(query, {
				model: db.device_op_info
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},

	getWaitTime: async function (req, res, next) {
		try {
			let query_date = "";
			let to = dayjs(req.query.to);
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query_date = ` AND DATE_FORMAT(b1.q_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			}else{ // "monthly"
				// 년간 조회
				query_date = ` AND DATE_FORMAT(b1.q_date, '%Y')= '${to.format("YYYY")}' `;
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , b1.q_date AS '발행날짜' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.t_q_cnt) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " + 
			`    ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '발행건수' " +  
			" ) AS UNSIGNED INTEGER) AS '발행건수' " + 
			" , " + 
			" ( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.t_wtime_avg) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " + 
			`    ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '평균대기시간' " +
			" ) AS '평균대기시간' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " + 
			`    ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '오전발행건수' " +
			" ) AS UNSIGNED INTEGER) AS '오전발행건수' " + 
			" , " + 
			" ( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.time_avg_1000) + SUM(b1.time_avg_1100) + SUM(b1.time_avg_1200) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " +
			`    ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '오전대기시간' " +
			" ) AS '오전대기시간' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.ticket_cnt_1400) + SUM(b1.ticket_cnt_1500) + SUM(b1.ticket_cnt_1600) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " +
			`  ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '오후발행건수' " +
			" ) AS UNSIGNED INTEGER) AS '오후발행건수' " + 
			" , " + 
			" ( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.time_avg_1400) + SUM(b1.time_avg_1500) + SUM(b1.time_avg_1600) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			"    WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.workno = 1 " +
			`    ${query_date}` + // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일
			"  ), 0) AS '오후대기시간' " +
			" ) AS '오후대기시간' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a.dev_id = b1.dev_id ` + 
			" WHERE " + 
			" b1.workno = 1 " + 
			// " AND a.site = '신촌세브란스' " + 
		 // " AND a.pos_1 = '본관' " + 	// 세부 정보 선택했을 경우
		 // " AND a.pos_2 = '1층' " + 	// 세부 정보 선택했을 경우
		 // " AND a.pos_3 = '응급실' " + 	// 세부 정보 선택했을 경우
		 	`  ${query_date}`; // b1.q_date 는 당월,전월,연간으로 WHERE 절 조건과 동일

			let result = await db.sequelize.query(query, {
				model: db.device_op_info
			});
			res.setHeader("token", req.headers.token);
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	}
};
module.exports = statistics;
