"use strict";
const passport = require("passport");
const { Op } = require("sequelize");
//const jwt = require("../utils/jwt-wrapper");
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
	}

};

module.exports = user;
