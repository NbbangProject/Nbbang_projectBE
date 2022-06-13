const router = require('express').Router();
const CommentCounter = require('../schemas/commentcounter');
const Comment = require('../schemas/comments');
const User = require('../schemas/users');
const authMiddlewares = require('../middlewares/authconfirm');

// 코멘트 작성: 유저확인

router.post('/detail/:postId', authMiddlewares, async (req, res) => {
  let counter = await CommentCounter.findOne({ name: 'totalComment' }).exec();
  counter.totalComment++;
  counter.save();
  const existingUser = await User.findOne({ _id: res.locals.userId });

  const commentId = counter.totalComment;
  const { comment } = req.body;
  const commentDate = new Date().toLocaleDateString();
  const userNickname = existingUser.userNickname;
  const userProfileImage = existingUser.userProfileImage;
  const authorId = res.locals.userId;
  const postId = parseInt(req.params);

  if (!comment) {
    res.status(400).json({ success: false, message: '내용을 입력하세요' });
  }
  const createdComment = await Comment.create({
    commentId,
    comment,
    commentDate,
    userNickname,
    userProfileImage,
    authorId,
    postId,
  });
  res.status(200).json({
    success: true,
    message: '댓글 저장 성공',
    comment: createdComment,
  });
});

// 코멘트 삭제: 유저확인
router.delete('/comment/:commentId', authMiddlewares, async (req, res) => {
  const { commentId } = req.params;
  const existingComment = await Comment.find({
    commentId: parseInt(commentId),
  });
  if (existingComment.length) {
    await Comment.deleteOne({ commentId: parseInt(commentId) });
    res.status(200).json({ success: true, message: '댓글 삭제 성공' });
  } else {
    res.status(400).json({ success: false, message: '댓글 삭제 실패' });
  }
});

module.exports = router;
