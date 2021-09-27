const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../controllers/authController");
const api = require("../controllers");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

module.exports = function () {
	router.get(
		"/user",
		isLoggedIn,
		api.user.checkLogin
	);

	router.post(
		"/user/login",
		isNotLoggedIn,
		api.user.userLogin
	);

	router.post(
		"/user/logout",
		api.user.userLogout
	);

	router.get(
		"/user/site",
		api.user.getSite
	);

	return router;
};