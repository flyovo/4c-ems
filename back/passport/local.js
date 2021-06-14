const passport = require("passport");
const mysqlPassword = require("mysql-password");
const { Strategy: LocalStrategy } = require("passport-local");
const db = require("../models");

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: "userId", // req.body.userId
		passwordField: "userPwd" // req.body.userPwd
	}, 
	async (userId, userPwd, done) => {
		try {
			const exUser = await db.user_login.findOne({
				where: { user_id: userId }
			});
			if (!exUser) {
				return done(null, false, { reason: "존재하지 않는 사용자입니다." });
			}
			if (mysqlPassword(userPwd) === exUser.pwd) {
				const parseUser = {
					user_id: exUser.user_id,
					pwd: exUser.pwd, 
					authority: exUser.authority 
				};
				return done(null, parseUser);
			} else {
				return done(null, false, { reason: "비밀번호가 틀립니다." });
			}
		} catch (err) {
			console.error(err);
			return done(err);
		}
	}));
};