"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const statistics = {
	getOutPatient: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` AND a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				queryPos += ` AND a1.pos_3 = '${position[3]}' `;
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.op_prog AS '용도' " + 
			",( " + 
				"  SELECT COUNT(DISTINCT a1.dev_id) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND b1.sunap_type like '%외래%' " + 
			" ) AS `대수` " + 
			" , CAST(SUM(b.cnt_his_query) AS UNSIGNED INTEGER) AS '수납가능건수' " + 
			" , CAST(SUM(b.cnt_sunap) AS UNSIGNED INTEGER) AS '수납건수' " + 
			" , CAST(SUM(b.cnt_sunap_x) AS UNSIGNED INTEGER) AS '수납불가' " + 
			" , CAST(SUM(b.amount) AS UNSIGNED INTEGER) AS '금액' " + 
			" , CAST(SUM(b.cnt_prescription) AS UNSIGNED INTEGER) AS '처방전 발급 건수' " + 
			" , CAST(SUM(b.cnt_pharm) AS UNSIGNED INTEGER) AS '약국 전송 건수' " + 
			" , CAST(SUM(b.cnt_parking_reg) AS UNSIGNED INTEGER) AS '주차등록' " + 
			" , CAST(SUM(b.cnt_parking_chg) AS UNSIGNED INTEGER) AS '차량등록/변경' " + 
			" , CAST(SUM(b.cnt_self_eval) AS UNSIGNED INTEGER) AS '진료전자기평가' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` +
			" WHERE ";

			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			query += " AND b.sunap_type LIKE '%외래%' ";

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.sunap_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
			}
		 
			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3 " + 
					 " ORDER BY a.pos_1, a.pos_2, a.pos_3 ";

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

	getLeaves: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			",( " + 
				"  SELECT COUNT(DISTINCT b1.cnt_sunap) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND b1.sunap_type like '%중간%' " + 
			" ) AS `중간건수` " + 
			",( " + 
				"  SELECT COUNT(DISTINCT b1.amount) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` + 
				"  AND b1.sunap_type like '%중간%' " + 
			" ) AS `중간금액` " +
			",( " + 
				"  SELECT COUNT(DISTINCT b1.cnt_sunap) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND b1.sunap_type like '%퇴원%' " + 
			" ) AS `퇴원건수` " + 
			",( " + 
				"  SELECT COUNT(DISTINCT b1.amount) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND b1.sunap_type like '%퇴원%' " + 
			" ) AS `퇴원금액` " +
			",( " + 
				"  SELECT COUNT(DISTINCT b1.cnt_his_query) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') " + 
			" ) AS `입퇴원비조회건수` " + 
			",( " + 
				"  SELECT COUNT(DISTINCT b1.cnt_sunap_x) " + 
				`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
				`  WHERE ${queryPos} ` +
				"  AND (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') " + 
			" ) AS `입퇴원비불능건수` " +
			" , CAST(SUM(b.cnt_parking_reg) AS UNSIGNED INTEGER) AS '주차등록건수' " + 
			" , CAST(SUM(b.cnt_parking_chg) AS UNSIGNED INTEGER) AS '주차변경건수' " + 
			" , CAST(SUM(b.cnt_bob_ins) AS UNSIGNED INTEGER) AS '보호자밥신청건수' " + 
			" , CAST(SUM(b.cnt_bob_chg) AS UNSIGNED INTEGER) AS '보호자밥변경건수' " + 
			" , CAST(SUM(b.cnt_bob_can) AS UNSIGNED INTEGER) AS '보호자밥취소건수' " + 
			" , CAST(SUM(b.cnt_bob_inq) AS UNSIGNED INTEGER) AS '보호자밥조회건수' " + 
			" , CAST(SUM(b.cnt_op_guide) AS UNSIGNED INTEGER) AS '수술진행안내건수' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` +
			" WHERE ";

			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			query += " AND (a.op_prog LIKE '%퇴원%' OR a.op_prog LIKE '%중간%') ";

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.certificate_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.certificate_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.certificate_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
			}
		 
			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3 " + 
					 " ORDER BY a.pos_1, a.pos_2, a.pos_3 ";

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

	getWeek: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ 
				queryPos += ` AND a1.pos_3 = '${position[3]}' `;
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT count(DISTINCT a1.dev_id) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} ` + 
			" ) AS UNSIGNED INTEGER) AS '대수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 2 ` + 
			" ) AS UNSIGNED INTEGER) AS '월건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 2 ` + 
			" ) AS UNSIGNED INTEGER) AS '월금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 3 ` + 
			" ) AS UNSIGNED INTEGER) AS '화건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 3 ` + 
			" ) AS UNSIGNED INTEGER) AS '화금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 4 ` + 
			" ) AS UNSIGNED INTEGER) AS '수건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 4 ` + 
			" ) AS UNSIGNED INTEGER) AS '수금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 5 ` + 
			" ) AS UNSIGNED INTEGER) AS '목건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 5 ` + 
			" ) AS UNSIGNED INTEGER) AS '목금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 6 ` + 
			" ) AS UNSIGNED INTEGER) AS '금건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 6 ` + 
			" ) AS UNSIGNED INTEGER) AS '금금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 7 ` + 
			" ) AS UNSIGNED INTEGER) AS '토건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 7 ` + 
			" ) AS UNSIGNED INTEGER) AS '토금액' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 1 ` + 
			" ) AS UNSIGNED INTEGER) AS '일건수' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} AND DAYOFWEEK(DATE_FORMAT(b1.sunap_date , '%Y-%m-%d')) = 1 ` + 
			" ) AS UNSIGNED INTEGER) AS '일금액' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE ";
			
			// 위치 조회
			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			// -- 수납 타입 선택
			// -- 수납 전체일 경우 사용 안함
			// -- and b.sunap_type like '%외래%' -- 수납 타입(외래수납 선택)
			// -- and b.sunap_type like '%중간%' -- 수납 타입(중간금수납 선택)
			// -- and b.sunap_type like '%퇴원%' -- 수납 타입(퇴원수납 선택)
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.sunap_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
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


	getCertification: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ 
				queryPos += ` AND a1.pos_3 = '${position[3]}' `;
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_01), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입퇴원증명서' ` + 
			" ) AS UNSIGNED INTEGER) AS '입퇴원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_02), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '통원증명서' ` + 
			" ) AS UNSIGNED INTEGER) AS '통원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_03), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '납입증명서' ` + 
			" ) AS UNSIGNED INTEGER) AS '납입증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_04), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '장애인증명서' ` + 
			" ) AS UNSIGNED INTEGER) AS '장애인증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_05), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입원영수증' ` + 
			" ) AS UNSIGNED INTEGER) AS '입원영수증' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_06), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '외래진료비' ` + 
			" ) AS UNSIGNED INTEGER) AS '외래진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_07), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '응급진료비' ` + 
			" ) AS UNSIGNED INTEGER) AS '응급진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.cnt_01) + SUM(b1.cnt_02) + SUM(b1.cnt_03) + SUM(b1.cnt_04) + SUM(b1.cnt_05) + SUM(b1.cnt_06) + SUM(b1.cnt_07) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${queryPos} GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '계' ` + 
			" ) AS UNSIGNED INTEGER) AS '계' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.certificate_daily_cnt.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE ";
			
			// 위치 조회
			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.certificate_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.certificate_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.certificate_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
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
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ 
				queryPos += ` AND a1.pos_3 = '${position[3]}' `;
			}
			
			// 날짜 조회
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
			" , CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.t_q_cnt) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '발행건수' " +  
			" ) AS UNSIGNED INTEGER) AS '발행건수' " + 
			",( " + 
			"  SELECT IFNULL(( " +
			"    SELECT CONCAT(LPAD(ROUND((SUM(b1.t_wtime_avg) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD(AUM(b1.t_wtime_avg), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD(AUM(b1.t_wtime_avg), 60)), '2', '0')) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '평균대기시간' " +
			" ) AS '평균대기시간' " + 
			",CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.ticket_cnt_1000) + SUM(b1.ticket_cnt_1100) + SUM(b1.ticket_cnt_1200) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '오전발행건수' " +
			" ) AS UNSIGNED INTEGER) AS '오전발행건수' " + 
			",( " + 
			"  select CONCAT(LPAD(ROUND(((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)), 60)), '2', '0')) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '오전대기시간' " +
			" ) AS '오전대기시간' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( select sum(b1.ticket_cnt_1400) + sum(b1.ticket_cnt_1500) + sum(b1.ticket_cnt_1600) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '오후발행건수' " +
			" ) AS UNSIGNED INTEGER) AS '오후발행건수' " + 
			" , " + 
			" ( " + 
			"  SELECT IFNULL(( select CONCAT(LPAD(ROUND(((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)), 60)), '2', '0')) " + 
			`    FROM ${db.device_op_info.name} a1 INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`    WHERE ${queryPos} AND b1.workno = 1 ${query_date} ` + 
			"  ), 0) AS '오후대기시간' " +
			" ) AS '오후대기시간' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.ticket_daily_cnt.name} b1 ON a.dev_id = b1.dev_id ` + 
			" WHERE ";

			// 위치 조회
			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			query += " AND b1.workno = 1 ";

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.q_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.q_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.q_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
			}

			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3, date_format(b.q_date, '%Y-%m') ";
			

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

	getArrive: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";
			
			let query = " SELECT " + 
			" b.act_type as '타입' " + 
			" , DATE_FORMAT(b.act_date, '%Y-%m-%d') AS '날짜' " + 
			" , a.site AS '센터명' " +
			" , a.pos_1 AS '기관' " +
			" , a.pos_2 AS '층수' " +
			" , a.pos_3 AS '구역' " +
			" , a.pos_4 AS '부서' " +
			" , a.dev_id AS 'ID' " +
			" , a.dev_model AS 'Model' " +
			" , b.tr_book_cnt AS '예약진료수' " +
			" , b.survey_success_cnt AS '문진성공' " +
			" , b.survey_fail_cnt AS '문진실패' " +
			" , b.success_cnt AS '도착확인성공' " +
			" , b.fail_cnt AS '도착확인실패' " +
			" , a.del_type AS '폐기여부' " +
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.etc_daily_cnt.name} b ON a.dev_id = b.dev_id ` +
			" WHERE " ; 
			
			// 위치 조회
			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.act_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.act_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.act_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
			}

			 query += " ORDER BY b.act_date, a.pos_1, a.pos_2, a.pos_3 ";


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

	getMeasurement: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			// 위치 조회
			let queryPos = "";
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				queryPos += ` a1.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				queryPos += ` AND a1.pos_2 = '${position[2]}' `;
			}

			let query = " SELECT " + 
			" b.act_type '타입' " + 
			" , DARE_FORMAT(b.act_date, '%Y-%m-%d') AS 날짜 " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS '부서' " + 
			" , a.dev_id AS 'ID' " + 
			" , a.dev_model AS 'Model' " + 
			" , b.act_type AS 'TYPE' " + 
			" , b.tr_book_cnt AS '예약진료수' " + 
			" , b.success_cnt AS '신체계측성공' " + 
			" , b.fail_cnt AS '신체계측실패' " + 
			" , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.etc_daily_cnt.name} b ON a.dev_id = b.dev_id ` +
			" WHERE ";

			// 위치 조회
			if(position[0]){
				query += ` a.site = '${position[0]}' `;
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				query += ` AND a.pos_1 = '${position[1]}' `;
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				query += ` AND a.pos_2 = '${position[2]}' `;
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				query += ` AND a.pos_3 = '${position[3]}' `;
			}

			query += " AND b.act_type LIKE '%신체계측%' ";

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "month"){ // 당월 조회, 전월 조회
				query += ` AND DATE_FORMAT(b.act_date, '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `;
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				query += ` AND DATE_FORMAT(b.act_date, '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `;
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				query += ` AND b.act_date BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${dayjs(req.query.endDate).format("YYYY-MM-DD")}', '%Y-%m-%d') `;
			}

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
	}
};
module.exports = statistics;
