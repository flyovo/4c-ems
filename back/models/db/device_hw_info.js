module.exports = (sequelize, DataTypes) => {
	const device_hw_info = sequelize.define("device_hw_info", {
		dev_id: {
			type: DataTypes.STRING(16),
			allowNull: false,
			primaryKey: true
		},
		dev_mac: {
			type: DataTypes.STRING(18),
			allowNull: true
		},
		dev_sub: {
			type: DataTypes.STRING(16),
			allowNull: true
		},
		dev_dns1: {
			type: DataTypes.STRING(18),
			allowNull: true
		},
		dev_dns2: {
			type: DataTypes.STRING(16),
			allowNull: true
		},
		resolution: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		os: {
			type: DataTypes.STRING(18),
			allowNull: true
		},
		cpu: {
			type: DataTypes.STRING(16),
			allowNull: true
		},
		ram: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		mb_pro: {
			type: DataTypes.STRING(128),
			allowNull: true
		},
		mb_model: {
			type: DataTypes.STRING(128),
			allowNull: true
		},
		hwdisk_size: {
			type: DataTypes.STRING(11),
			allowNull: true
		},
		ins_dt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		upt_dt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return device_hw_info;
};