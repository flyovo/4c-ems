const express = require("express");
const router = express.Router();
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

module.exports = function () {
	router.get(
		"/statistics/out-patient",
		isLoggedIn,
		api.statistics.getOutPatient
	);
	
	router.get(
		"/statistics/in-patient",
		isLoggedIn,
		api.statistics.getInPatient
	);
	
	router.get(
		"/statistics/certification",
		isLoggedIn,
		api.statistics.getCertification
	);

	router.get(
		"/statistics/week",
		isLoggedIn,
		api.statistics.getWeek
	);

	router.get(
		"/statistics/wait",
		isLoggedIn,
		api.statistics.getWaitTime
	);

	return router;
};
