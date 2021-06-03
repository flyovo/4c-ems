const express = require("express");
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

module.exports = function () {
	router.get(
		"/",
		isLoggedIn,
		api.user.checkLogin
	);

	router.post(
		"/login",
		isNotLoggedIn,
		api.user.userLogin
	);

	router.post(
		"/logout",
		api.user.userLogout
	);

	return router;
};