exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		const token = req.cookies[credentials.cookie.session];
		jwt.verify(token, req.app.get("jwt-secret"), (err, decoded) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					const error = new Error(err);
					error.status = 9401;
					res.clearCookie(credentials.cookie.session);
					return next(error);
				} else {
					const error = new Error(err);
					error.status = 9401;
					return next(error);
				}
			}
	
			req.token = decoded;
			return next();
		});

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
