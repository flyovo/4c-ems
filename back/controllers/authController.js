//const jwt = require("../utils/jwt-wrapper");
const jwt = require("jsonwebtoken");

module.exports = {
	checkUser: async function (req, res, next) {
		const token = req.header("token");
		if (!token) {
			const error = new Error("not logged in");
			error.status = 401;

			throw error;
		}

		try {
			req.token = await jwt.verify(token, req.app.get("jwt-secret"));
			return next();
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				res.clearCookie(config.cookie.session);
			}

			const error = new Error(err);
			error.status = 9401;

			throw error;
		}
	}
};