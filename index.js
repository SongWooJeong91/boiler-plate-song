// express 모듈을 가져온다
const express = require("express");
// express함수를 이용해 새로은 express app을 만들어준다.
const app = express();
// 사용 할 포트 설정
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded 분석해서 가져오게 해주는 코드
app.use(bodyParser.urlencoded({ extended: true }));
// appication/json 타입을 분석해서 가져오게 해주는 코드
app.use(bodyParser.json());
app.use(cookieParser());
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

app.post("/api/users/register", (req, res) => {
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

// 로그인 라우터
app.post("/api/users/login", (req, res) => {
  // 데이터베이스 안에서 로그인 할 email 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요청된 이메일이 있다면 비밀번호가 맞는지 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 비밀번호가 틀렸다면
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
    });
    // 비밀번호가 맞다면 Token 생성
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

// auth 라우터
// role 0 => 일반유저 role != 0 => 관리자
app.get("/api/users/auth", auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는
  // Authentication이 True라는 말

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: "",
    },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// 이 앱을 포트 5000에서 실행
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
