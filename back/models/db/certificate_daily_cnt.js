module.exports = (sequelize, DataTypes) => {
	const certificate_daily_cnt = sequelize.define("certificate_daily_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		certificate_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		cnt_01: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_02: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_03: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_04: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_05: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_06: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_07: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_08: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_09: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_10: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return certificate_daily_cnt;
};