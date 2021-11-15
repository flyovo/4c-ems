"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const rawData = {
	// 외래&입원 수납 Data
	getStorage: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
			" b.sunap_type AS '수납타입' " +
			" , DATE_FORMAT(b.sunap_date, '%Y-%m-%d') AS '날짜' " +
			" , SUBSTR( _UTF8'일월화수목금토', DAYOFWEEK(b.sunap_date), 1) AS '요일' " +
			" , a.site AS '센터명' " +
			" , a.pos_1 AS '기관' " +
			" , a.pos_2 AS '층' " +
			" , a.pos_3 AS '구역' " +
			" , a.pos_4 AS '부서' " +
			" , a.pos_0 AS '창구코드' " +
			" , a.dev_model AS 'Model' " +
			" , b.chart_no AS '등록번호' " +
			" , b.cnt_his_query AS '수납가능건수' " +
			" , DATE_FORMAT(b.sunap_date, '%H:%i') AS '수납시간' " +
			" , b.cnt_sunap AS '수납건수' " +
			" , b.cnt_sunap_x AS '수납불가' " +
			" , b.amount AS '수납금액' " +
			" , b.cnt_prescription AS '처방전 발급 건수' " +
			" , b.cnt_pharm AS '약국 전송 건수' " +
			" , b.pharm_name AS '약국' " +
			" , b.cnt_ticket AS '번호표' " +
			" , b.cnt_parking_reg as '차량등록' " +
			" , b.cnt_parking_chg as '차량변경' " +
			" , a.del_type  AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.sunap_rt_log.name} b ON a.dev_id = b.dev_id `;

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
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.sunap_date), '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.sunap_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}
			
			where.push(" b.chart_no <> '' ");
			
			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}
			
			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
			}

			query += " ORDER BY b.sunap_date, a.pos_1, a.pos_2, a.pos_3 ";

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

	// 증명서 발급 Data
	getCertification: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
			" DATE_FORMAT(b.certificate_date , '%Y-%m-%d') AS '날짜' " + 
			" , SUBSTR( _UTF8'일월화수목금토', DAYOFWEEK(b.certificate_date), 1) AS '요일' " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS 'ID' " + 
			" , a.pos_0 AS '창구코드' " +
			" , a.dev_model AS 'Model' " + 
			" , b.chart_no AS '등록번호' " + 
			" , DATE_FORMAT(b.certificate_date, '%H:%i') AS '발급시간' " + 
			" , b.certificate_name AS '증명서 종류' " + 
			" , CAST(IFNULL(b.cnt_certificate, 0) AS UNSIGNED INTEGER) AS '발급건수' " + 
			" , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.certificate_rt_log.name} b ON a.dev_id = b.dev_id `;

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

			// 증명서 타입 선택
			// 전체를 선택했을 경우엔 위 조건 사용 안함
			let col_nm = "";
			switch(req.query.option){
				case "입퇴원증명서": col_nm = "CNT_01"; break;
				case "통원증명서": col_nm = "CNT_02"; break;
				case "납입증명서(타기관)": col_nm = "CNT_03"; break;
				case "장애인증명서": col_nm = "CNT_04"; break;
				case "입원영수증": col_nm = "CNT_05"; break;    
				case "외래진료비": col_nm = "CNT_06"; break;      
				case "응급진료비": col_nm = "CNT_07"; break;         
				case "납입증명서(연말정산)": col_nm = "CNT_08"; break; 
				case "납입증명서(난임진료)": col_nm = "CNT_09"; break; 
				case "예비": col_nm = "CNT_10"; break;
				default: col_nm = ""; break;
			}
			if(col_nm !== ""){
				where.push(` b.col_nm = '${col_nm}' `);
			}
				
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.certificate_date), '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.certificate_date), '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
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

			query += " ORDER BY b.certificate_date, a.pos_1, a.pos_2, a.pos_3 ";

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

	// 도착확인 Data
	getArrive: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
			" b.act_type AS '타입' " + 
			" , DATE_FORMAT(b.act_date, '%Y-%m-%d') AS '날짜' " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS '부서' " + 
			" , a.dev_id AS 'ID' " + 
			" , a.dev_model AS 'Model' " + 
			" , b.chart_no AS '등록번호' " + 
			" , b.tr_book_cnt AS '예약진료수' " + 
			" , b.survey_success_cnt AS '문진성공' " + 
			" , b.survey_fail_cnt AS '문진실패' " + 
			" , b.success_cnt AS '도착확인성공' " + 
			" , b.fail_cnt AS '도착확인실패' " + 
			" , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.etc_rt_log.name} b ON a.dev_id = b.dev_id `;

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
			
			where.push(" b.act_type LIKE '%도착확인%' ");
			where.push(" a.op_prog LIKE '%도착확인%' ");
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.act_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			where.push(" b.chart_no <> '' ");

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

	// 신체계측 Data
	getMeasurements: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
			" b.act_type AS '타입' " + 
			" , DATE_FORMAT(b.act_date, '%Y-%m-%d') AS '날짜' " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS '부서' " + 
			" , a.dev_id AS 'ID' " + 
			" , a.dev_model AS 'Model' " + 
			" , b.chart_no AS '등록번호' " + 
			" , b.tr_book_cnt AS '예약진료수' " + 
			" , b.success_cnt AS '신체계측성공' " + 
			" , b.fail_cnt AS '신체계측실패' " + 
			" , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.etc_rt_log.name} b ON a.dev_id = b.dev_id `;

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

			// 신체계측 타입 선택
			let act_type = "";
			switch(req.query.option){
				case "신체계측 전체": act_type = "%신체계측%"; break;
				case "신체계측(혈압)": act_type = "%혈압%"; break;
				case "신체계측(신장체중)": act_type = "%신장체중%"; break;
				default: act_type = "%신체계측%"; break;
			}
			where.push(` b.act_type like '${act_type}' `);
			where.push(" a.op_prog LIKE '%신체%' ");
			
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.act_date), '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.act_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}

			where.push(" b.chart_no <> '' ");

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

	// 실패 Data
	getFailure: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT " + 
				" DATE_FORMAT(b.fail_date, '%Y-%m-%d') AS '날짜' " + 
				" , a.site AS '센터명' " + 
				" , a.pos_1 AS '기관' " + 
				" , a.pos_2 AS '층' " + 
				" , a.pos_3 AS '구역' " + 
				" , a.pos_4 AS '부서' " + 
				" , a.dev_id AS 'ID' " + 
				" , b.chart_no AS '등록번호' " + 
				" , b.fail_op_prog AS 'PGM종류' " + 
				" , b.fail_message AS '실패Message' " + 
				` FROM ${db.device_op_info.name} a INNER JOIN ${db.fail_daily_cnt.name} b ON a.dev_id = b.dev_id `;

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

			// 콤보박스데이터
			if(req.query.option){ // // 콤보박스
				where.push(` b.fail_op_prog = '${req.query.option}' `);
			}
				
			// 기간 선택
			// 전체일 경우 사용 안함
			if(req.query.dateTerm === "weekly"){ // 당월 조회, 전월 조회
				where.push(` DATE_FORMAT(DATE(b.fail_date), '%Y-%m') = '${dayjs(req.query.endDate).format("YYYY-MM")}' `);
			}
			if(req.query.dateTerm === "monthly"){ // 연간 조회
				where.push(` DATE_FORMAT(DATE(b.fail_date), '%Y') = '${dayjs(req.query.endDate).format("YYYY")}' `);
			}
			if(req.query.dateTerm === "term"){ // 기간 조회
				let endDate = dayjs(req.query.endDate).format("YYYY-MM-DD");
				where.push(` DATE(b.fail_date) BETWEEN DATE_FORMAT('${dayjs(req.query.startDate).format("YYYY-MM-DD")}', '%Y-%m-%d') AND DATE_FORMAT('${endDate}', '%Y-%m-%d') `);
			}
			
			// 'S' 일 경우 조건 사용 안함
			// 'A', 'P' 일 경우
			if((req.query.auth === "A" || req.query.auth === "P") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
			}

			query += " ORDER BY b.fail_date, a.pos_1, a.pos_2, a.pos_3 ";
	
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
	getCombobox: async function (req, res, next) {
		try {
		// 콤보박스 데이터
			let position = req.query.position ? req.query.position.split(",") : "";

			let query = " SELECT b.fail_op_prog " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.fail_daily_cnt.name} b ON a.dev_id = b.dev_id `;
			
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

			if((req.query.auth === "P" || req.query.auth === "A") && req.query.pos_4){
				where.push(` a.pos_4 = '${req.query.pos_4}' `);
			}

			if(where.length > 0){
				query += ` WHERE ${ where.join(" AND ") }`;
			}

			query += " GROUP BY b.fail_op_prog ";
			query += " ORDER BY b.fail_op_prog ";

		
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
module.exports = rawData;
