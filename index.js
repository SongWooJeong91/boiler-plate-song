// express 모듈을 가져온다
const express = require("express");
// express함수를 이용해 새로은 express app을 만들어준다.
const app = express();
// 사용 할 포트 설정
const port = 5000;

// 몽구스 연결
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://woojeong:abcd1234@movieclone.cwb7e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("MogoDB Connected..."))
  .catch((err) => console.log(err));

// respond with "hello world" when a GET request is made to the homepage
// express app을 넣어주는 코드
app.get("/", (req, res) => res.send("Hello World!"));
// 이 앱을 포트 5000에서 실행
app.listen(port, () => console.log(`Example app listening on prot ${port}!`));
