const Sequelize = require("sequelize");
const config = {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: "mysql",
	timezone: "+09:00"
};

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.autooff_holiday = require("./db/autooff_holiday")(sequelize, Sequelize);
db.autooff_time = require("./db/autooff_time")(sequelize, Sequelize);
db.certificate_daily_cnt = require("./db/certificate_daily_cnt")(sequelize, Sequelize);
db.certificate_rt_log = require("./db/certificate_rt_log")(sequelize, Sequelize);
db.device_hw_info = require("./db/device_hw_info")(sequelize, Sequelize);
db.device_op_info = require("./db/device_op_info")(sequelize, Sequelize);
db.etc_daily_cnt = require("./db/etc_daily_cnt")(sequelize, Sequelize);
db.etc_rt_log = require("./db/etc_rt_log")(sequelize, Sequelize);
db.fail_daily_cnt = require("./db/fail_daily_cnt")(sequelize, Sequelize);
db.site_pos_manage = require("./db/site_pos_manage")(sequelize, Sequelize);
db.sunab_pharm_transfer_cnt = require("./db/sunab_pharm_transfer_cnt")(sequelize, Sequelize);
db.sunap_daily_cnt = require("./db/sunap_daily_cnt")(sequelize, Sequelize);
db.sunap_rt_log = require("./db/sunap_rt_log")(sequelize, Sequelize);
db.ticket_daily_cnt = require("./db/ticket_daily_cnt")(sequelize, Sequelize);
db.user_login = require("./db/user_login")(sequelize, Sequelize);
db.user_organ_manage = require("./db/user_organ_manage")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;