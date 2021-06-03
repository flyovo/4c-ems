const user = require("./userController");
const dashboard = require("./dashboardController");

const api = {
	user: user,
	dashboard: dashboard
};

module.exports = api;
