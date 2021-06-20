const express = require("express");
const router = express.Router();
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

module.exports = function () {
	router.get(
		"/rawdata/receipt",
		isLoggedIn,
		api.rawdata.getReceipt
	);
	
	router.get(
		"/rawdata/certification",
		isLoggedIn,
		api.rawdata.getCertification
	);

	return router;
};
