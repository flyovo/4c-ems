const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated() || req.headers.token) {
		return next();
	}
	return res.status(401).send({ reason: "로그인이 필요합니다." });
};
  
exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	return res.status(403).send({ reason: "로그인한 사람은 할 수 없습니다.." });
};
