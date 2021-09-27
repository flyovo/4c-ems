module.exports = (sequelize, DataTypes) => {
	const user_login = sequelize.define("user_login", {
		user_id: {
			type: DataTypes.STRING(21),
			allowNull: false,
			primaryKey: true
		},
		pwd: {
			type: DataTypes.STRING(128),
			allowNull: true
		},
		authority: {
			type: DataTypes.STRING(2),
			allowNull: true
		},
		organ: {
			type: DataTypes.STRING(4),
			allowNull: true
		},
		pos_4: {
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
  
	return user_login;
};