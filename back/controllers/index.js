const user = require("./userController");
const dashboard = require("./dashboardController");
const rawdata = require("./rawDataController");
const statistics = require("./statisticsController");

const api = {
	user: user,
	dashboard: dashboard,
	rawdata: rawdata,
	statistics: statistics
};

module.exports = api;
