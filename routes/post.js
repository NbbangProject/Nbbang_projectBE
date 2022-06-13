const router = require('express').Router();
const Comment = require('../schemas/comments');
const Post = require('../schemas/posts');
const authMiddlewares = require('../middlewares/authconfirm');

// 포스트 수정 :

router.put('/edit/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const {
    postCategory,
    postTitle,
    postImage,
    postAddress,
    postOrderTime,
    postContent,
  } = req.body;
  const existingPost = await Post.find({ authorId: res.locals.userId });

  if (res.locals.userId !== existingPost.authorId) {
    res.status(400).json({ sucess: false, message: '내 게시물이 아닙니다' });
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
});

// 포스트 삭제 : 유저확인,삭제되는 포스트와 같은 postId값 가진 댓글들도 삭제
router.delete('/post/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const existingPost = await Post.find({ postId: parseInt(postId) });
  if (existingPost.length) {
    await Post.deleteOne({ postId: parseInt(postId) });
    await Comment.deleteMany({ postId: parseInt(postId) });
    res.status(200).json({ success: true, message: '게시물 삭제 성공' });
  } else {
    res.status(400).json({ success: false, message: '게시물 삭제 실패' });
  }
});

module.exports = router;
