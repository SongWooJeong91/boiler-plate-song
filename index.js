// express 모듈을 가져온다
const express = require("express");
// express함수를 이용해 새로은 express app을 만들어준다.
const app = express();
// 사용 할 포트 설정
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

// application/x-www-form-urlencoded 분석해서 가져오게 해주는 코드
app.use(bodyParser.urlencoded({ extended: true }));
// appication/json 타입을 분석해서 가져오게 해주는 코드
app.use(bodyParser.json());

// 몽구스 연결
// github에 올릴 때 아이디랑 비번을 올리면 안되기 때문에 안올라가게 설정
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MogoDB Connected..."))
  .catch((err) => console.log(err));

// respond with "hello world" when a GET request is made to the homepage
// express app을 넣어주는 코드
app.get("/", (req, res) => res.send("Hello World!"));

app.post("/register", (req, res) => {
  // 회원가입 시 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  // 몽고디비 설정
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// 이 앱을 포트 5000에서 실행
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
