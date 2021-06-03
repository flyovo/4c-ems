"use strict";
const passport = require("passport");

const dashboard = {
	getCertification: async function (req, res, next) {
		try {
			const query = ` SELECT ${db.RoomPatList.name}.ROOM_NO, ${db.RoomSet.name}.ROOM_NM, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ` + 
							` ${db.RoomPatList.name}.SEX, ${db.RoomPatList.name}.STATUS, ` + 
							` IFNULL(${db.RoomPatList.name}.RECEIPT_TIME, 0), IFNULL(${db.RoomPatList.name}.ARRIVE_TIME, 0) ` + 
							` FROM ${db.RoomPatList.name} ` +
							` JOIN ${db.RoomSet.name} on ${db.RoomPatList.name}.ROOM_NO = ${db.RoomSet.name}.ROOM_NO ` +
							` WHERE ${db.RoomPatList.name}.PAT_NO = :pat_no ` +
							` ORDER BY ${db.RoomPatList.name}.ROOM_NO `;
			const result = await db.sequelize.query(query, {
				model: db.RoomPatList,
				replacements: { pat_no: req.params.PAT_NO }
			});
			res.json(result);
		} catch (err) {
			console.error(err);
			next(err);
		}
	}
};

module.exports = dashboard;
