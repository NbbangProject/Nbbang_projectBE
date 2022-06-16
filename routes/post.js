const express = require('express');
const app = express();
const router = require('express').Router();
const path = require('path');
const Comment = require('../schemas/comments');
const Post = require('../schemas/posts');
const User = require('../schemas/users');
const authMiddlewares = require('../middlewares/authconfirm');
const multer = require('multer');

// 이미지 업로드 Multer
const upload = multer({
  dest: 'upload/',
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
    fileFilter: (req, file, cb) => {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
        cd(null, true);
      else cd(Error('PNG, jpeg만 업로드 하세요'), false);
    },
    // const ext = path.extname(file.originalname);
    //     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    //         return callback(new Error('PNG, JPG만 업로드하세요'))
    //     }
    //     callback(null, true)
    // },
    limits: {
      fileSize: 1024 * 1024,
    },
  }),
});

// 유저정보 불러오기

router.get('/userData', async (req, res) => {
  try {
    const users = await User.find().exec();
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Post 전체 정보 불러오기
router.get('/postList', async (req, res) => {
  try {
    const posts = await Post.find().sort({ postId: -1 }); //오름차순 정렬
    res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Post 상세 보기
router.get(
  '/detail/:postId',
  // authMiddlewares,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const detail = await Post.findOne({ postId: parseInt(postId) });
      const existingComment = await Comment.find({
        postId: parseInt(postId),
      }).sort({ commentId: -1 });

      res.status(200).json({
        detail,
        existingComment,
        message: '상세페이지 보기 성공',
      });
    } catch (err) {
      res.status(400).json({
        errorMessage: '상세페이지 보기 실패',
      });
      console.log('Post 상세페이지 보기 실패: ' + err);
    }
  }
);
//Post 작성
router.post(
  '/write',
  authMiddlewares,
  upload.single('postImage'),
  async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
      const { userId } = res.locals.user;
      const existingUser = await User.findOne({ _id: userId });
      const postImage = 'http://3.39.226.20/' + req.file.path.split('/')[1];
      const {
        postCategory,
        postTitle,
        postAddress,
        postOrderTime,
        postOrderDate,
        postContent,
      } = req.body;

      const now = new Date();
      const date = now.toLocaleDateString('ko-KR');
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const postDate = date + ' ' + hours + ':' + minutes;
      const userNickname = existingUser.userNickname;
      const authorId = existingUser._id;
      const createPost = await Post.create({
        postCategory,
        postTitle,
        postImage,
        postAddress,
        postOrderDate,
        postOrderTime,
        postContent,
        postDate,
        userNickname,
        authorId,
      });

      res
        .status(200)
        .send({ Posts: createPost, message: '게시글을 작성했습니다.' });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        errorMessage: 'Post생성 실패',
      });
    }
  }
);

// 포스트 수정 :

router.put(
  '/edit/:postId',
  authMiddlewares,
  upload.single('postImage'),
  async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const postImage = 'http://3.39.226.20/' + req.file.path.split('/')[1];
    const { postCategory, postTitle, postAddress, postOrderTime, postContent } =
      req.body;
    const existingPost = await Post.findOne({ postId: parseInt(postId) });

    if (userId !== existingPost.authorId.toString()) {
      res.status(400).json({ success: false, message: '내 게시물이 아닙니다' });
    } else {
      await Post.updateOne(
        { postId: parseInt(postId) },
        {
          $set: {
            postCategory,
            postTitle,
            postImage,
            postAddress,
            postOrderTime,
            postContent,
          },
        }
      );
      res.status(200).json({ success: true, message: '게시물 수정 완료' });
    }
  }
);

// 포스트 삭제 : 유저확인,삭제되는 포스트와 같은 postId값 가진 댓글들도 삭제
router.delete('/post/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const existingPost = await Post.findOne({ postId: parseInt(postId) });
  if (userId !== existingPost.authorId.toString()) {
    res.status(400).json({ success: false, message: '내 게시물이 아닙니다' });
  } else {
    await Post.deleteOne({ postId: parseInt(postId) });
    await Comment.deleteMany({ postId: parseInt(postId) });
    res.status(200).json({ success: true, message: '게시물 삭제 성공' });
  }
});

module.exports = router;
