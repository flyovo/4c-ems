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
		"/statistics/leaves",
		isLoggedIn,
		api.statistics.getLeaves
	);

	router.get(
		"/statistics/week",
		isLoggedIn,
		api.statistics.getWeek
	);
	
	router.get(
		"/statistics/certification",
		isLoggedIn,
		api.statistics.getCertification
	);

	router.get(
		"/statistics/wait-time",
		isLoggedIn,
		api.statistics.getWaitTime
	);

	router.get(
		"/statistics/arrive",
		isLoggedIn,
		api.statistics.getArrive
	);

	router.get(
		"/statistics/measurements",
		isLoggedIn,
		api.statistics.getMeasurement
	);

	return router;
};
