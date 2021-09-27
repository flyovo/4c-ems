module.exports = (sequelize, DataTypes) => {
	const etc_rt_log = sequelize.define("etc_rt_log", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		act_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		dev_id: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		act_type: {
			type: DataTypes.STRING(128),
			allowNull: false
		},
		chart_no: {
			type: DataTypes.STRING(13),
			allowNull: true
		},
		tr_book_cnt: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		survey_success_cnt: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		survey_fail_cnt: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		success_cnt: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		fail_cnt: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		fail_type: {
			type: DataTypes.STRING(128),
			allowNull: true
		},
		fail_message: {
			type: DataTypes.STRING(1024),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return etc_rt_log;
};