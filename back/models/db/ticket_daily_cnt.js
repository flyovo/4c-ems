module.exports = (sequelize, DataTypes) => {
	const ticket_daily_cnt = sequelize.define("ticket_daily_cnt", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		dev_id: {
			type: DataTypes.STRING(11),
			allowNull: false
		},
		q_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		workno: {
			type: DataTypes.STRING(4),
			allowNull: false
		},
		wtime_max: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		wcntt_max: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		t_wtime_avg: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		t_ctime_avg: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		t_q_cnt: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_0000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_0000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_0000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_0000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_0700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_0700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_0700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_0800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_0700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_0800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_0800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_0800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_0900: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_0900: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_0900: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_0900: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1000: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1100: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1100: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1100: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1100: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1200: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1200: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1200: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1200: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1300: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1300: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1300: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1300: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1500: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1500: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1500: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1500: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1600: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1600: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1600: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1600: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1700: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_1800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_1800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_1800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_1800: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ticket_cnt_2400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		time_avg_2400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_cnt_2400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		call_yet_cnt_2400: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	return ticket_daily_cnt;
};