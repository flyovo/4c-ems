module.exports = (sequelize, DataTypes) => {
	const device_op_info = sequelize.define("device_op_info", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(21),
			allowNull: false
		},
		dev_type: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		dev_model: {
			type: DataTypes.STRING(15),
			allowNull: true
		},
		op_prog: {
			type: DataTypes.STRING(21),
			allowNull: true
		},
		dev_ip: {
			type: DataTypes.STRING(16),
			allowNull: false
		},
		dev_mac: {
			type: DataTypes.STRING(18),
			allowNull: true
		},
		site: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		pos_1: {
			type: DataTypes.STRING(21),
			allowNull: true
		},
		pos_2: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		pos_3: {
			type: DataTypes.STRING(32),
			allowNull: true
		},
		pos_4: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		wol_time: {
			type: DataTypes.STRING(5),
			allowNull: true
		},
		poweroff: {
			type: DataTypes.STRING(4),
			allowNull: true
		},
		ins_dt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		upt_dt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		del_type: {
			type: DataTypes.STRING(2),
			allowNull: true
		},
		del_dt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		desc: {
			type: DataTypes.STRING(128),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return device_op_info;
};