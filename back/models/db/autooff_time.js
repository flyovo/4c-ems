module.exports = (sequelize, DataTypes) => {
	const autooff_time = sequelize.define("autooff_time", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		group_nm: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		off_date: {
			type: DataTypes.STRING(4096),
			allowNull: true
		},
		updatedate: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return autooff_time;
};