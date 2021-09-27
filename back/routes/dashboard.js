const express = require("express");
const router = express.Router();
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

module.exports = function () {
	router.get(
		"/dashboard/kiosk",
		isLoggedIn,
		api.dashboard.getKiosk
	);
	
	router.get(
		"/dashboard/certificate",
		isLoggedIn,
		api.dashboard.getCertificate
	);

	router.get(
		"/dashboard/wait",
		isLoggedIn,
		api.dashboard.getWait
	);

	router.get(
		"/dashboard/menu",
		isLoggedIn,
		api.dashboard.getMenuUse
	);
	
	return router;
};
