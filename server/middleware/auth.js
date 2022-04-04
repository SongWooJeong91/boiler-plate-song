const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;
  // 토큰을 복호화 하고 user를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    // 라우터에서 req.ㅇㅇㅇ 으로 token, user 정보를 가질 수 있게 하기 위해서
    // request에 넣어주었다.
    req.token = token;
    req.user = user;
    // next()를 넣어주는 이유는 미들웨어에서 다음 실행으로 넘어 갈 수 있게
    next();
  });
  // user가 있으면 인증 ok

  // user가 없으면 인증 no
};
module.exports = { auth };
