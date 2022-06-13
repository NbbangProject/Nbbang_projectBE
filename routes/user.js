const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const authMiddlewares = require('../middlewares/authconfirm');
// const LocalStrategy = require('passport-local').Strategy;
const connect = require('../schemas');
const User = require('../schemas/users');
connect();

// 이미지 업로드 Multer
const upload = multer({
  dest: 'upload/',
  // storage: multer.diskStorage({
  //     destination(req, file, cb) {
  //         cb(null, 'uploads/');
  //     },
  //     filename(req, file, cb) {
  //         const ext = path.extname(file.originalname);
  //         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  //     },
  //     fileFilter: (req, file, callback) => {
  //         const ext = path.extname(file.originalname);
  //         if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
  //             return callback(new Error('PNG, JPG만 업로드하세요'))
  //         }
  //         callback(null, true)
  //     },
  //     limits: {
  //         fileSize: 1024 * 1024
  //     }
  // }),
});

// 검증 Joi 라이브러리
const userSchema = Joi.object({
  userNickname: Joi.string().required(),
  userPassword: Joi.string().required(),
  confirmPassword: Joi.string(),
  userEmail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  regionSi: Joi.string().required(),
  regionGu: Joi.string().required(),
  regionDetail: Joi.string().required(),
});

// 회원가입시 프로필 사진이 들어갈 폴더
// app.use(express.static('../public/image'))

//회원가입
router.post('/signup', upload.single('userProfileImage'), async (req, res) => {
  try {
    const {
      userNickname,
      userEmail,
      userPassword,
      confirmPassword,
      regionSi,
      regionGu,
      regionDetail,
    } = await userSchema.validateAsync(req.body);
    const userProfileImage = req.file.path;

    const re_email =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
    const re_password = /^[a-zA-Z0-9]{4,30}$/;

    if (userPassword !== confirmPassword) {
      res.status(400).send({
        errormessage: '패스워드가 일치 하지 않습니다',
      });
      return;
    }

    if (userNickname.search(re_nickname) == -1) {
      res.status(400).send({
        errormessage: '닉네임 형식이 일치하지 않습니다',
      });
      return;
    }

    if (userEmail.search(re_email) == -1) {
      res.status(400).send({
        errormessage: '이메일 형식이 일치하지 않습니다',
      });
      return;
    }

    if (userPassword.search(re_password) == -1) {
      res.status(412).send({
        errormessage: '패스워드 형식이 일치하지 않습니다',
      });
      return;
    }

    if (userNickname === userPassword) {
      res.status(400).send({
        errormessage: '닉네임과 비밀번호가 동일합니다',
      });
      return;
    }
    const existuser = await User.find({
      $or: [{ userNickname }, { userEmail }],
    });
    // const existuserEmail = await User.find({ userEmail });
    if (existuser.length) {
      res.status(400).send({
        errormessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
      });
      return;
    }
    // userProfileImage
    const user = await User.create({
      userNickname,
      userEmail,
      userPassword,
      confirmPassword,
      regionSi,
      regionGu,
      regionDetail,
      userProfileImage,
    });
    await user.save();

    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ errormessage: '요청한 데이터 형식이 올바르지 않습니다' });
  }
});

const loginAuthSchema = Joi.object({
  userEmail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  userPassword: Joi.string().required(),
});

// 로그인 기능
router.post('/login', async (req, res) => {
  try {
    const { userEmail, userPassword } = await loginAuthSchema.validateAsync(
      req.body
    );
    const re_email =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const re_password = /^[a-zA-Z0-9]{4,30}$/;
    const isEmail = await User.findOne({ userEmail, userPassword });

    if (userEmail.search(re_email) == -1) {
      res.status(400).send({
        errormessage: '이메일 형식이 일치 하지 않습니다.',
      });
      return;
    }
    if (userPassword.search(re_password) == -1) {
      res.status(400).send({
        errormessage: '비밀번호 형식이 일치 하지 않습니다.',
      });
      return;
    }

    if (!isEmail || userPassword !== isEmail.userPassword) {
      res.status(400).send({
        errormessage: '닉네임 또는 패스워드를 확인해주세요',
      });
      return;
    }
    const token = jwt.sign({ userId: isEmail.userId }, 'nbbang-sercet-key', {
      expiresIn: '1h',
    });
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(400).send({});
  }
});

// 로그인 상태 확인
router.get('/auth', authMiddlewares, async (req, res) => {
  try {
    const { user } = res.locals;
    console.log(res.locals);
    console.log(user);
    res.status(200).send({ user });
  } catch (error) {
    res.status(401).send({
      errormessage: '사용자 정보를 가져오지 못하였습니다.',
    });
  }
});

module.exports = router;
