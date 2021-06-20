"use strict";
const db = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const rawData = {
	getReceipt: async function (req, res, next) {
		try {
			let query = " SELECT " + 
			" b.sunap_type AS '수납타입', " + 
			" DATE_FORMAT(b.sunap_date, '%Y-%m-%d') AS 날짜, " + 
			" SUBSTR('일월화수목금토', DAYOFWEEK(b.sunap_date), 1) AS 요일, " + 
			" a.site AS '센터명', " + 
			" a.pos_1 AS '기관', " + 
			" a.pos_2 AS '층', " + 
			" a.pos_3 AS '구역', " + 
			" a.pos_4 AS 'ID', " + 
			" a.dev_model AS 'Model', " + 
			" b.chart_no AS '등록번호', " + 
			" DATE_FORMAT(b.sunap_date, '%H:%i') AS '수납시간', " + 
			" CAST(b.cnt_sunap AS UNSIGNED INTEGER) AS '수납건수', " + 
			" CAST(b.amount AS UNSIGNED INTEGER) AS '수납금액', " + 
			" b.pharm_name AS '처방전전송', " + 
			" a.del_type AS '폐기여부' " + 
		` FROM ${db.device_op_info.name} a INNER JOIN ${db.sunap_rt_log.name} b ON a.dev_id = b.dev_id ` + 
		" WHERE " + 
			// " a.site = '신촌세브란스' ";
			//    " AND a.pos_1 = '본관' " +  // 세부 정보 선택했을 경우
			//    " AND a.pos_2 = '1층' " +  // 세부 정보 선택했을 경우
			//    " AND a.pos_3 = '응급실' " +  // 세부 정보 선택했을 경우
	
			   		" b.sunap_type LIKE '%외래%' ";  // 외래수납 선택했을 경우
			//    " AND b.sunap_type LIKE '%외래%' " +  // 외래수납 선택했을 경우
			//    " AND b.sunap_type LIKE '%중간%' " +  // 중간금수납 선택했을 경우
			//    " AND b.sunap_type LIKE '%퇴원%' " +  // 퇴원수납 선택했을 경우
			//    전체 수납을 선택했을 경우엔 위 조건 사용 안함

			let to = dayjs(req.query.to);
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
				//    " AND DATE_FORMAT(b.sunap_date, '%Y-%m') = '2021-06' " +  // 당월을 선택했을 경우
				//    " AND DATE_FORMAT(b.sunap_date, '%Y-%m') = '2021-05' " +  // 전월을 선택했을 경우
			}else{ // "monthly"
				// 년간 조회
				query += ` AND DATE_FORMAT(b.sunap_date, '%Y')= '${to.format("YYYY")}' `;
				//    " AND DATE_FORMAT(b.sunap_date, '%Y') = '2021' " +  // 년간을 선택했을 경우
			}

			query += " AND b.chart_no <> '' " + 
				 " AND b.amount <> '' ";

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
			let query = " SELECT " + 
			" DATE_FORMAT(b.certificate_date , '%Y-%m-%d') AS '날짜' " + 
			" , SUBSTR('일월화수목금토', DAYOFWEEK(b.certificate_date), 1) AS '요일' " + 
			" , a.site AS '센터명' " + 
			" , a.pos_1 AS '기관' " + 
			" , a.pos_2 AS '층' " + 
			" , a.pos_3 AS '구역' " + 
			" , a.pos_4 AS 'ID' " + 
			" , a.dev_model AS 'Model' " + 
			" , b.chart_no AS '등록번호' " + 
			" , DATE_FORMAT(b.certificate_date, '%H:%i') AS '발급시간' " + 
			" , b.certificate_name AS '증명서 종류' " + 
			" , CAST(b.cnt_certificate AS UNSIGNED INTEGER) AS '발급건수' " + 
			" , a.del_type AS '폐기여부' " + 
			` FROM ${db.device_op_info.name} a INNER JOIN ${db.certificate_rt_log.name} b ON a.dev_id = b.dev_id ` + 
			" WHERE " ;
			// " a.site = '신촌세브란스' " + 
			// " AND a.pos_1 = '본관' " +  // 세부 정보 선택했을 경우
			// " AND a.pos_2 = '1층' " +  // 세부 정보 선택했을 경우
			// " AND a.pos_3 = '응급실' " +  // 세부 정보 선택했을 경우
			
			// " b.col_nm = 'CNT_01' ";
			// 증명서 전체를 선택했을 경우엔 위 조건 사용 안함
			// b.col_nm 값
			// CNT_01: 입퇴원증명서
			// CNT_02: 통원증명서
			// CNT_03: 납입증명서
			// CNT_04: 장애인증명서
			// CNT_05: 입원영수증
			// CNT_06: 외래진료비
			// CNT_07: 응급진료비
			// CNT_08: 예비
			// CNT_09: 예비
			// CNT_10: 예비
		   
			let to = dayjs(req.query.to);
			if(req.query.term === "weekly"){
				// 당월 조회 or 전월 조회 
				query += ` DATE_FORMAT(b.certificate_date, '%Y-%m') = '${to.format("YYYY-MM")}' `;
			}else{ // "monthly"
				// 년간 조회
				query += ` DATE_FORMAT(b.certificate_date, '%Y')= '${to.format("YYYY")}' `;
			}

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
	}
};
module.exports = rawData;
