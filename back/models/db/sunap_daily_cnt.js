module.exports = (sequelize, DataTypes) => {
	const sunap_daily_cnt = sequelize.define("sunap_daily_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		sunap_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		sunap_type: {
			type: DataTypes.STRING(21),
			allowNull: false
		},
		cnt_his_query: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_sunap: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_sunap_x: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		amount: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		cnt_prescription: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_pharm: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_parking_reg: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_parking_chg: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_ticket: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_self_eval: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_op_guide: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_bob_ins: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_bob_chg: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_bob_can: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_bob_inq: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_rsv_01: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_rsv_02: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_rsv_03: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		cnt_rsv_04: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return sunap_daily_cnt;
};