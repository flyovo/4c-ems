"use strict";
const passport = require("passport");
const db = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const user = {
	checkLogin: async function (req, res, next) {
		const user = await req.user;
		res.json(user);
	},

	userLogin: function (req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (info) {
				return res.status(401).send(info);
			}
			return req.login(user, async err => { // 세션에다 사용자 정보 저장 (어떻게? serializeUser)
				if (err) {
					console.error(err);
					return await next(err);
				}

				let query = " select " +
				"  a.user_id as id  " +
				", a.authority  " +
				", (select b1.loc_name from user_login a1 inner join site_pos_manage b1 on a1.organ = b1.idx where a1.user_id = id) as organ  " +
				", (select b1.loc_name from user_login a1 inner join site_pos_manage b1 on a1.pos_4 = b1.idx where a1.user_id = id) as pos_4 " +
				", a.updatedate " +
				" from user_login a inner join site_pos_manage b on a.pos_4 = b.idx  " +
				` where a.user_id = '${user.user_id}'  and a.pwd = '${user.pwd}' `;

				return new Promise((resolve, reject) => {
					const secret = req.app.get("jwt-secret");
					const expired = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7days
					jwt.sign(
						{
							exp: Math.floor(expired / 1000),
							user_id: user.user_id,
							authority: user.authority
						},
						secret,
						{
							algorithm: "HS256",
							issuer: "4c-ems",
							subject: "ems"
						},
						(err, token) => {
							if (err) {return reject({ error: err });}

							db.sequelize.query(query, {
								model: db.user_login
							}).then(async result => {
								return await resolve(
									res.json({ 
										data: result[0],
										token: token,
										resultCd: 200
									})
								);
							});
						}
					);
				});					
			});
		})(req, res, next);
	},

	userLogout: function (req, res, next) {
		if (req.isAuthenticated()) {
			req.logout();
			req.session.destroy(); // 선택사항
			return res.status(200).send("로그아웃 되었습니다.");
		}
	},


	getSite: async function (req, res, next) {
		try {
			let position = req.query.position ? req.query.position.split(",") : "";
			// req.query
			// { site: 'site', position: ['site', 'pos_1', 'pos_2'] -> text, 
			//   state: {organ, pos_4}, auth: localStorage.getItem('4c-userAuth') }

			// let organ = req.query.organ ? ` pos_1 = '${req.query.organ}' ` : "";
			// let pos_4 = req.query.pos_4 ? ` pos_4 = '${req.query.pos_4}' ` : "";

			let query = ` SELECT ${req.query.site} AS label FROM ${db.device_op_info.name} `;
			let where = [];
			switch(req.query.site){
				case "site" : // 사이트
					if(req.query.auth === "P"){
						if(req.query.organ){
							where.push(` pos_1 = '${req.query.organ}' `);
						}
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}else if(req.query.auth === "A"){
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}
					break;
				case "pos_1" : // 기관명
					where.push(` site = '${position[0]}' `);
					if(req.query.auth === "P"){
						if(req.query.organ){
							where.push(` pos_1 = '${req.query.organ}' `);
						}
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}else if(req.query.auth === "A"){
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}
					break;
				case "pos_2" : // 층
					where.push(` site = '${position[0]}' `);
					where.push(` pos_1 = '${position[1]}' `);
					if(req.query.auth === "P" || req.query.auth === "A"){
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}
					break;
				case "pos_3" : // 부서
					where.push(` site = '${position[0]}' `);
					where.push(` pos_1 = '${position[1]}' `);
					where.push(` pos_2 = '${position[2]}' `);
					if(req.query.auth === "P" || req.query.auth === "A"){
						if(req.query.pos_4){
							where.push(` pos_4 = '${req.query.pos_4}' `);
						}
					}
					break;
			}

			if(where.length > 0){
				query += " WHERE ";
				query += where.join(" AND ");
			}

			query += ` group by ${req.query.site} `;

			console.log("query::::::::::", query);

			let result = [];
			await db.sequelize.query(query, {
				model: db.device_op_info
			}).then(rows => {
				// get columns & data
				rows.forEach(row => {
					result.push({
						id: row.dataValues.label,
						label: row.dataValues.label
						// children: []
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

module.exports = user;
