module.exports = (sequelize, DataTypes) => {
	const fail_daily_cnt = sequelize.define("fail_daily_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		fail_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		fail_op_prog: {
			type: DataTypes.STRING(21),
			allowNull: true
		},
		fail_type: {
			type: DataTypes.STRING(21),
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
  
	return fail_daily_cnt;
};