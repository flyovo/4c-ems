module.exports = (sequelize, DataTypes) => {
	const certificate_rt_log = sequelize.define("certificate_rt_log", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		customer_id: {
			type: DataTypes.STRING(11),
			allowNull: true
		},
		certificate_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		chart_no: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		col_nm: {
			type: DataTypes.STRING(7),
			allowNull: true
		},
		certificate_name: {
			type: DataTypes.STRING(31),
			allowNull: true
		},
		cnt_certificate: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return certificate_rt_log;
};