const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
	passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
		return done(null, { userId: user.userId });  // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
	});
	passport.deserializeUser(async (userId, done) => {
		try {
			const user = await db.user_login.findOne({ 
				attributes: ["authority", "user_id", "pwd", "organ", "pos_4"],
				where: { user_id: userId } 
			});
			return done(null, user); // req.user, req.isAuthenticated() === true,
		} catch (err) {
			console.error(err);
			return done(err);
		}
	});

	local(); 
};