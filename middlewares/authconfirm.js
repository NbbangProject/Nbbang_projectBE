const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || '').split(' ');
  console.log(authorization);
  if (!tokenValue || tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능합니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, 'nbbang-sercet-key');
    User.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
        if (!user) {
          res.status(400).send({
            errorMessage: '회원가입이 필요합니다',
          });
        }
      });
  } catch (err) {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능합니다.',
    });
  }
};
