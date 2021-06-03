const express = require("express");
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

module.exports = function () {
	router.get(
		"/dashboard/certification",
		isLoggedIn,
		api.dashboard.getCertification
	);
	
	return router;
};
