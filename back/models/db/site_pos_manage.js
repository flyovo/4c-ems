module.exports = (sequelize, DataTypes) => {
	const site_pos_manage = sequelize.define("site_pos_manage", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		type: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		loc_name: {
			type: DataTypes.STRING(32),
			allowNull: false
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
  
	return site_pos_manage;
};