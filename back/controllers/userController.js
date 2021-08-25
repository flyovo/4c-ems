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
				
				//req.session.save(() => {
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
							//res.token = token;
							return resolve({ token: token });
						}
					);
				}).then(content => {
					return res.json({
						data: user,
						token: content.token,
						resultCd: 200
					});
				});
				//});
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
			// req.query
			// { site: 'site', position: ['site', 'pos_1', 'pos_2'], 
			//   state: {organ, pos_4}, auth: localStorage.getItem('4c-userAuth') }

			// let organ = req.query.state.organ ? ` pos_1 = ${req.query.state.organ} ` : "";
			// let pos_4 = req.query.state.pos_4 ? ` pos_4 = ${req.query.state.pos_4} ` : "";

			let query = ` SELECT ${req.query.site} FROM ${db.device_op_info.name} `;
			switch(req.query.site){
				case "site" : // 사이트
					if(req.query.auth === "P"){
						// query += (!organ && !pos_4) ?  
						query += ` WHERE pos_1 = ${req.query.state.organ} AND pos_4 = ${req.query.state.pos_4} `;
					}else if(req.query.auth === "A"){
						query += req.query.state.pos_4 ? ` WHERE pos_4 = ${req.query.state.pos_4} ` : "";
					}
					break;
				case "pos_1" : // 기관명
					query += ` WHERE site = ${req.query.position[0]} `;
					if(req.query.auth === "P"){
						query += ` AND pos_1 = ${req.query.state.organ} AND pos_4 = ${req.query.state.pos_4} `;
					}else if(req.query.auth === "A"){
						query += ` AND pos_4 = ${req.query.state.pos_4} `;
					}
					break;
				case "pos_2" : // 층
					query += ` WHERE site = ${req.query.position[0]} `;
					query += ` AND pos_1 = ${req.query.position[1]} `;
					if(req.query.auth === "P" || req.query.auth === "A"){
						query += ` AND pos_4 = ${req.query.state.pos_4} `;
					}
					break;
				case "pos_3" : // 부서
					query += ` WHERE site = ${req.query.position[0]} `;
					query += ` AND pos_1 = ${req.query.position[1]} `;
					query += ` AND pos_2 = ${req.query.position[2]} `;
					if(req.query.auth === "P" || req.query.auth === "A"){
						query += ` AND pos_4 = ${req.query.state.pos_4} `;
					}
					break;
			}
			query += ` group by ${req.query.site} `;

			let result = [];
			await db.sequelize.query(query, {
				model: db.device_op_info
			}).then(rows => {
				// get columns & data
				rows.forEach(row => {
					result.push({
						id: row.dataValues.site,
						label: row.dataValues.site,
						children: []
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
