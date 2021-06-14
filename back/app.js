const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./models");
const passportConfig = require("./passport");
const apiRoutes = require("./routes");
const app = express();

db.sequelize.sync();
passportConfig();

if (process.env.NODE_ENV === "production") {
	app.use(morgan("combined"));
} else {
	app.use(morgan("dev"));
}

// 프론트의 환경 설정
app.use(cors({ //다른 서버간 쿠키 각각 저장하기 위함
	origin: `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
	credentials: true
}));

//app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set the secret key variable for jwt
const jwtsecret = "4c-ems-key-secret";
//app.use(cookie("cookie-secret"));
app.use(cookie(jwtsecret));
app.set("jwt-secret", Buffer.from(jwtsecret.toString("base64")));

//app.use(session({ // 세션 활성화
//	name: "4_ems",
//	resave: true,
//	saveUninitialized: false,
//	//secret: "cookie-secret"
//	secret: jwtsecret,
//	cookie: {
//		httpOnly: true,
//		secure: false
//	}
//}));
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

app.get("/", (req, res) => {
	res.status(200).send("hi back");
});

app.use("/api", apiRoutes());

// socket.io --------------------------------------------------------------
//let http = require("http");
//let server = http.createServer(app);
//server.listen((process.env.PORT || 9528), function () {
app.listen((process.env.PORT || 9528), function () {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
