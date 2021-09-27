module.exports = (sequelize, DataTypes) => {
	const sunab_pharm_transfer_cnt = sequelize.define("sunab_pharm_transfer_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		year_month: {
			type: DataTypes.STRING(7),
			allowNull: false
		},
		pharm_name: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		count: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return sunab_pharm_transfer_cnt;
};