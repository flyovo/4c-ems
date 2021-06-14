const express = require("express");
const router = express.Router();

const userRoute = require("./user");
const dashboardRoute = require("./dashboard");

module.exports = function () {
	router.use(userRoute());
	router.use(dashboardRoute());

	// catch 404 and forward to error handler
	router.all("/*", function (req, res, next) {
		const error = new Error("Invalid Url");
		error.status = 404;
		next(error);
	});

	return router;
};
