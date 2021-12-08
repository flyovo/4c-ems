"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const statistics = {
	// 외래수납
	getOutPatient: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}

			let query = " SELECT " + 
			" a.site AS '센터명' " +
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.op_prog AS '용도' " + 
			",( " + 
				" SELECT COUNT(DISTINCT a1.dev_id) " + 
				" FROM device_op_info a1 INNER JOIN sunap_daily_cnt b1 ON a1.dev_id = b1.dev_id " + 
				// " WHERE a1.pos_1 = '기관' AND a1.pos_2 = '층' AND a1.pos_3 = '구역' AND b1.sunap_type LIKE '%외래%' " + 
				` WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} AND b1.sunap_type LIKE '%외래%' AND a1.del_type = 'N' ` : " b1.sunap_type LIKE '%외래%' AND a1.del_type = 'N' "}   ` + 
			" ) AS `대수` " + 
			" , CAST(IFNULL(SUM(b.cnt_his_query), 0) AS UNSIGNED INTEGER) AS '수납가능건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_sunap), 0) AS UNSIGNED INTEGER) AS '수납건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_sunap_x), 0) AS UNSIGNED INTEGER) AS '수납불가' " + 
			" , CAST(IFNULL(SUM(b.amount), 0) AS UNSIGNED INTEGER) AS '금액' " + 
			" , CAST(IFNULL(SUM(b.cnt_prescription), 0) AS UNSIGNED INTEGER) AS '처방전 발급 건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_pharm), 0) AS UNSIGNED INTEGER) AS '약국 전송 건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_parking_reg), 0) AS UNSIGNED INTEGER) AS '주차등록' " + 
			" , CAST(IFNULL(SUM(b.cnt_parking_chg), 0) AS UNSIGNED INTEGER) AS '차량등록/변경' " + 
			" , CAST(IFNULL(SUM(b.cnt_self_eval), 0) AS UNSIGNED INTEGER) AS '진료전자기평가' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id `;


			// " WHERE " ;
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			where.push(" b.sunap_type LIKE '%외래%' ");

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.sunap_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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

	// 퇴원수납
	getLeaves: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , ( " +  
			"	select ifnull(sum(b1.cnt_sunap), 0) " +
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and b1.sunap_type like '%중간%'  " +
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and b1.sunap_type like '%중간%' ` : " b1.sunap_type like '%중간%' "}   ` + 
			"	) as '중간건수'  " + 
			" ,(  " +
			"	select ifnull(sum(b1.amount), 0)   " + 
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and b1.sunap_type like '%중간%' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and b1.sunap_type like '%중간%' ` : " b1.sunap_type like '%중간%' "}   ` + 
			"	) as '중간금액' " +  
			" ,(  " + 
			"	select ifnull(sum(b1.cnt_sunap), 0)   " + 
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층'  and b1.sunap_type like '%퇴원%'  " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and b1.sunap_type like '%퇴원%' ` : " b1.sunap_type like '%퇴원%' "}   ` + 
			"	) as '퇴원건수'  " + 
			" ,(  " + 
			"	select ifnull(sum(b1.amount), 0)   " + 
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층'  and b1.sunap_type like '%퇴원%'  " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and b1.sunap_type like '%퇴원%' ` : " b1.sunap_type like '%퇴원%' "}   ` + 
			"	) as '퇴원금액'  " + 
			" ,(  " + 
			"	select ifnull(sum(b1.cnt_his_query), 0)   " + 
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층'  and (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%')  " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') ` : " (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') "}   ` + 
			"	) as '입퇴원비조회건수'  " + 
			" ,(  " +
			"	select ifnull(sum(b1.cnt_sunap_x), 0)   " + 
			`	from ${db.device_op_info.name} a1 inner join ${db.sunap_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층'  and (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%')  " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}  and (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') ` : " (b1.sunap_type like '%퇴원%' OR b1.sunap_type like '%중간%') "}   ` + 
			"   ) as '입퇴원비불능건수'  " +
			" , CAST(IFNULL(SUM(b.cnt_parking_reg), 0) AS UNSIGNED INTEGER) AS '주차등록건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_parking_chg), 0) AS UNSIGNED INTEGER) AS '주차변경건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_ins), 0) AS UNSIGNED INTEGER) AS '보호자밥신청건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_chg), 0) AS UNSIGNED INTEGER) AS '보호자밥변경건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_can), 0) AS UNSIGNED INTEGER) AS '보호자밥취소건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_bob_inq), 0) AS UNSIGNED INTEGER) AS '보호자밥조회건수' " + 
			" , CAST(IFNULL(SUM(b.cnt_op_guide), 0) AS UNSIGNED INTEGER) AS '수술진행안내건수' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id `;

			// " WHERE " ;
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			where.push(" (a.op_prog LIKE '%퇴원%' OR a.op_prog LIKE '%중간%') ");

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.sunap_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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

	// 요일별수납
	getWeek: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" ( " + 
			"  SELECT count(DISTINCT a1.dev_id) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} AND a1.del_type = 'N' ` : " a1.del_type = 'N' "}   ` + 
			"  ) AS '대수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 2 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 2 "} ` + 
			"  ) AS '월건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 2 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 2 "} ` + 
			"  ) AS '월금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 3 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 3 "} ` + 
			"  ) AS '화건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 3 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 3 "} ` + 
			"  ) AS '화금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 4 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 4 "} ` + 
			"  ) AS '수건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 4 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 4 "} ` + 
			"  ) AS '수금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 5 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 5 "} ` + 
			"  ) AS '목건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 5 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 5 "} ` + 
			"  ) AS '목금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 6 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 6 "} ` + 
			"  ) AS '금건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 6 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 6 "} ` + 
			"  ) AS '금금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 7 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 7 "} ` + 
			"  ) AS '토건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 7 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 7 "} ` + 
			"  ) AS '토금액' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.cnt_sunap), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` +
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 1 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 1 "} ` + 
			"  ) AS '일건수' " + 
			" ,( " + 
			"  SELECT IFNULL(SUM(b1.amount), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.sunap_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			`  WHERE ${subPos.length > 0 ? ` ${subPos.join(" AND ")} and DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 1 ` : " DAYOFWEEK(date_format(b1.sunap_date , '%Y-%m-%d')) = 1 "} ` + 
			"  ) AS '일금액' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.sunap_daily_cnt.name} b ON a.dev_id = b.dev_id `;
			
			// " WHERE " ;
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			// 수납 타입 선택
			// 수납 전체일 경우 사용 안함
			if(req.query.option === "외래 수납"){ // 수납 타입(외래수납 선택)
				where.push(" b.sunap_type LIKE '%외래%' ");
			}
			if(req.query.option === "중간금 수납"){ // 수납 타입(중간금수납 선택)
				where.push(" b.sunap_type LIKE '%중간%' ");
			}
			if(req.query.option === "퇴원 수납"){ // 수납 타입(퇴원수납 선택)
				where.push(" b.sunap_type LIKE '%퇴원%' ");
			}
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.sunap_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}
			
			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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
	
	// 증명서발급
	getCertification: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}

			let query = " SELECT " + 
			" a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_01), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입퇴원증명서' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입퇴원증명서'  ` + 
			" ) AS UNSIGNED INTEGER) AS '입퇴원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_02), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '통원증명서' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '통원증명서'  ` + 
			" ) AS UNSIGNED INTEGER) AS '통원증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_03), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '납입증명서' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '납입증명서'  ` + 
			" ) AS UNSIGNED INTEGER) AS '납입증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_04), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '장애인증명서' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '장애인증명서'  ` + 
			" ) AS UNSIGNED INTEGER) AS '장애인증명서' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_05), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입원영수증' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '입원영수증'  ` + 
			" ) AS UNSIGNED INTEGER) AS '입원영수증' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_06), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '외래진료비' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '외래진료비'  ` + 
			" ) AS UNSIGNED INTEGER) AS '외래진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT IFNULL(SUM(b1.cnt_07), 0) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '응급진료비' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '응급진료비'  ` + 
			" ) AS UNSIGNED INTEGER) AS '응급진료비' " + 
			" , " + 
			" CAST(( " + 
			"  SELECT IFNULL(( SELECT SUM(b1.cnt_01) + SUM(b1.cnt_02) + SUM(b1.cnt_03) + SUM(b1.cnt_04) + SUM(b1.cnt_05) + SUM(b1.cnt_06) + SUM(b1.cnt_07) " + 
			`  FROM ${db.device_op_info.name} a1 INNER JOIN ${db.certificate_daily_cnt.name} b1 ON a1.dev_id = b1.dev_id ` + 
			// "  WHERE a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역'   GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '계' " + 
			`  ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")} ` : "" } GROUP BY a1.pos_1, a1.pos_2 ), 0) AS '계'  ` + 
			" ) AS UNSIGNED INTEGER) AS '계' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.certificate_daily_cnt.name} b ON a.dev_id = b.dev_id `;
			
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.certificate_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.certificate_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.certificate_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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

	// 수납대기시간
	getWaitTime: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}
			subPos.push(" b1.workno = 1 ");
			subPos.push(" date_format(b1.q_date , '%Y-%m-%d') = date_format(b.q_date , '%Y-%m-%d') ");

			let query = " SELECT " + 
			" a.site AS '센터명' " +
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , b.q_date AS '발행날짜' " + 
			" ,	 (select ifnull((  " +
			"	select sum(b1.t_q_cnt)  " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	), 0) as '발행건수') as '발행건수',  " +
			"	(select ifnull((  " +
			"	select CONCAT(LPAD(ROUND((sum(b1.t_wtime_avg) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD(sum(b1.t_wtime_avg), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD(sum(b1.t_wtime_avg), 60)), '2', '0'))    " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	 ), 0) as '평균대기시간') as '평균대기시간',  " +
			"	(select ifnull((  " +
			"	select sum(b1.ticket_cnt_1000) + sum(b1.ticket_cnt_1100) + sum(b1.ticket_cnt_1200)  " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	 ), 0) as '오전발행건수') as '오전발행건수',  " +
			"	(select ifnull((  " +
			"	select CONCAT(LPAD(ROUND(((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1000) + sum(b1.time_avg_1100) + sum(b1.time_avg_1200)), 60)), '2', '0'))  " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	 ), 0) as '오전대기시간') as '오전대기시간',  " +
			"	(select ifnull((  " +
			"	select sum(b1.ticket_cnt_1400) + sum(b1.ticket_cnt_1500) + sum(b1.ticket_cnt_1600)  " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	), 0) as '오후발행건수') as '오후발행건수', " +
			"	(select ifnull((  " +
			"	select CONCAT(LPAD(ROUND(((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)) / 3600)), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)), 3600) / 60), '2', '0'), ':', LPAD(ROUND(MOD((sum(b1.time_avg_1400) + sum(b1.time_avg_1500) + sum(b1.time_avg_1600)), 60)), '2', '0'))  " +
			`	from ${db.device_op_info.name} a1 inner join ${db.ticket_daily_cnt.name} b1 on a1.dev_id = b1.dev_id  ` +
			// "	where a1.pos_1 = '기관' and a1.pos_2 = '층' and a1.pos_3 = '구역' and b1.workno = 1  and  date_format(b1.q_date , '%Y-%m-%d') = '발행날짜'  " +
			`	where ${subPos.join(" AND ")}  ` +
			"	), 0) as '오후대기시간') as '오후대기시간'  " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.ticket_daily_cnt.name} b ON a.dev_id = b.dev_id `;
			
			// " WHERE ";
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			where.push(" b.workno = 1 ");

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.q_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.q_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.q_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
			}

			query += " GROUP BY a.pos_1, a.pos_2, a.pos_3, date_format(b.q_date, '%Y-%m-%d') ";

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

	// 도착확인
	getArrive: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";
			
			let query = " SELECT " + 
			" b.act_type as '타입' " + 
			" , DATE_FORMAT(b.act_date, '%Y-%m-%d') AS '날짜' " + 
			" , a.site AS '센터명' " +
			" , a.pos_1 AS '기관' " +
			" , a.pos_2 AS '층' " +
			" , a.pos_3 AS '구역' " +
			" , a.pos_4 AS '부서' " +
			" , a.dev_id AS 'ID' " +
			" , a.dev_model AS 'Model' " +
			// " , b.tr_book_cnt AS '예약진료수' " +
			// " , b.survey_success_cnt AS '문진성공' " +
			// " , b.survey_fail_cnt AS '문진실패' " +
			" , b.success_cnt AS '도착확인성공' " +
			" , b.fail_cnt AS '도착확인실패' " +
			// " , a.del_type AS '폐기여부' " +
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.etc_daily_cnt.name} b ON a.dev_id = b.dev_id `; 
			
			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			// 도착확인만 조회
			let act_type = "%도착%";
			where.push(` b.act_type like '${act_type}' `);
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.act_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}
 			
			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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

	// 신체계측
	getMeasurement: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
			" b.act_type '타입' " + 
			" , DATE_FORMAT(b.act_date, '%Y-%m-%d') AS '날짜' " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS '부서' " + 
			" , a.dev_id AS 'ID' " + 
			" , a.dev_model AS 'Model' " + 
			" , b.act_type AS 'TYPE' " + 
			// " , b.tr_book_cnt AS '예약진료수' " + 
			" , b.success_cnt AS '신체계측성공' " + 
			" , b.fail_cnt AS '신체계측실패' " + 
			// " , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a LEFT JOIN ${db.etc_daily_cnt.name} b ON a.dev_id = b.dev_id `;

			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			// 신체계측 타입 선택
			let act_type = "";
			switch(req.query.option){
				case "신체계측 전체": act_type = "%신체계측%"; break;
				case "신체계측(혈압)": act_type = "%혈압%"; break;
				case "신체계측(신장체중)": act_type = "%신장체중%"; break;
				default: act_type = "%신체계측%"; break;
			}
			where.push(` b.act_type like '${act_type}' `);

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.act_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
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
	},
	getFailure: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let subPos = [];
			// 위치 조회
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				subPos.push(` a1.pos_1 = '${position[1]}' `);
			}else{
				subPos.push(" a1.pos_1 = a.pos_1 ");
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				subPos.push(` a1.pos_2 = '${position[2]}' `);
			}else{
				subPos.push(" a1.pos_2 = a.pos_2 ");
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				subPos.push(` a1.pos_3 = '${position[3]}' `);
			}else{
				subPos.push(" a1.pos_3 = a.pos_3 ");
			}

			if(req.query.option){
				subPos.push(` b1.fail_op_prog = '${req.query.option}' `);
			}else{
				subPos.push(" b1.fail_op_prog = b.fail_op_prog ");
			}
			subPos.push(" date_format(b1.fail_date, '%Y-%m-%d') = date_format(b.fail_date, '%Y-%m-%d') ");

			let query = " select " +
			" date_format(b.fail_date, '%Y-%m-%d') AS '날짜', " +
			" a.site AS '센터명', " +
			" a.pos_1 as '기관', " +
			" a.pos_2 as '층', " +
			" a.pos_3 as '구역', " +
			" b.fail_op_prog as 'PGM종류', " +
			" b.fail_message as '실패Message', " +
			" (   " +
			" select count(*)    " +
			" from device_op_info a1 inner join fail_daily_cnt b1 on a1.dev_id = b1.dev_id   " +
				` ${subPos.length > 0 ? ` WHERE ${subPos.join(" AND ")}` : "" } ` +
			" ) as 'COUNT'  " +
			" from device_op_info  a inner join fail_daily_cnt b on a.dev_id = b.dev_id  ";

			let where = [];

			// 위치 조회
			if(position[0]){
				where.push(` a.site = '${position[0]}' `);
			}
			if(position[1]){ // 좌측 Tree에서 기관 선택했을 경우
				where.push(` a.pos_1 = '${position[1]}' `);
			}
			if(position[2]){ // 좌측 Tree에서 층 선택했을 경우
				where.push(` a.pos_2 = '${position[2]}' `);
			}
			if(position[3]){ // 좌측 Tree에서 구역 선택했을 경우
				where.push(` a.pos_3 = '${position[3]}' `);
			}

			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.fail_date), '%Y-%m') = '${dayjs(req.query.startDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.fail_date), '%Y') = '${dayjs(req.query.startDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.fail_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			if(req.query.option){ // // 콤보박스
				where.push(` b.fail_op_prog = '${req.query.option}' `);
			}

			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
			}

			query += " GROUP BY b.fail_message ";
			query += " ORDER BY 'COUNT' ";

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
