module.exports = (sequelize, DataTypes) => {
	const user_organ_manage = sequelize.define("user_organ_manage", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		organ_name: {
			type: DataTypes.STRING(21),
			allowNull: true
		},
		organ_info: {
			type: DataTypes.STRING(20),
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
  
	return user_organ_manage;
};