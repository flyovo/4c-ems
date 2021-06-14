const jwt = require("jsonwebtoken");
module.exports = {
	sign: function (payload, secretOrPrivateKey, options) {
		return new Promise((resolve, reject) => {
			jwt.sign(payload, secretOrPrivateKey, options, function (err, token) {
				if (err) {
					return reject(err);
				}

				return resolve(token);
			});
		});
	},

	verify: function (token, secretOrPublicKey, options) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, secretOrPublicKey, options, function (err, decoded) {
				if (err) {
					return reject(err);
				}

				return resolve(decoded);
			});
		});
	}
};
