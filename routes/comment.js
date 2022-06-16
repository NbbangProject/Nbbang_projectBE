const router = require('express').Router();
const Post = require('../schemas/posts');
const Comment = require('../schemas/comments');
const User = require('../schemas/users');
const authMiddlewares = require('../middlewares/authconfirm');

// 코멘트 작성: 유저확인

router.post('/detail/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const existingUser = await User.findOne({ _id: userId });
  const { comment } = req.body;

  const now = new Date();
  const date = now.toLocaleDateString('ko-KR');
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const commentDate = date + ' ' + hours + ':' + minutes;

  const userNickname = existingUser.userNickname;
  const userProfileImage = existingUser.userProfileImage;
  const authorId = existingUser._id;

  if (!comment) {
    res.status(400).json({ success: false, message: '내용을 입력하세요' });
  }
  const createdComment = await Comment.create({
    comment,
    commentDate,
    userNickname,
    userProfileImage,
    authorId,
    postId,
  });
  const commentAll = await Comment.find({ postId: parseInt(postId) });
  await Post.updateOne(
    { postId: parseInt(postId) },
    { $set: { commentAll: commentAll.length } }
  );
  res.status(200).json({
    success: true,
    message: '댓글 저장 성공',
    comment: createdComment,
  });
});

// 코멘트 삭제: 유저확인
router.delete('/comment/:commentId', authMiddlewares, async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user;
  const existingComment = await Comment.findOne({
    commentId: parseInt(commentId),
  });

  if (userId !== existingComment.authorId.toString()) {
    res
      .status(400)
      .json({ success: false, message: '내가 쓴 댓글이 아닙니다' });
  } else {
    await Comment.deleteOne({ commentId: parseInt(commentId) });
    const commentAll = await Comment.find({
      postId: parseInt(existingComment.postId),
    });
    await Post.updateOne(
      { postId: parseInt(existingComment.postId) },
      { $set: { commentAll: commentAll.length } }
    );
    res.status(200).json({ success: true, message: '댓글 삭제 성공' });
  }
});

module.exports = router;
