const express = require("express");
const router = express.Router();
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

module.exports = function () {
	router.get(
		"/rawdata/hospital-storage",
		isLoggedIn,
		api.rawdata.getStorage
	);	
	router.get(
		"/rawdata/certification",
		isLoggedIn,
		api.rawdata.getCertification
	);
	router.get(
		"/rawdata/arrive",
		isLoggedIn,
		api.rawdata.getArrive
	);
	router.get(
		"/rawdata/measurements",
		isLoggedIn,
		api.rawdata.getMeasurements
	);
	router.get(
		"/rawdata/failure",
		isLoggedIn,
		api.rawdata.getFailure
	);
	router.get(
		"/rawdata/combo",
		isLoggedIn,
		api.rawdata.getCombobox
	);
	return router;
};
