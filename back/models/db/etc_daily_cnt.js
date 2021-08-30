module.exports = (sequelize, DataTypes) => {
	const etc_daily_cnt = sequelize.define("etc_daily_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		act_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		act_type: {
			type: DataTypes.STRING(128),
			allowNull: false
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
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return etc_daily_cnt;
};