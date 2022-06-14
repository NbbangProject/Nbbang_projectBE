const router = require('express').Router();
const Comment = require('../schemas/comments');
const Post = require('../schemas/posts');
const authMiddlewares = require('../middlewares/authconfirm');


// Post 전체 정보 불러오기
router.get("/postId", async (req, res) => {
  try {
  const posts = await posts.find().sort({ date: -1 }); //오름차순 정렬
  res.json({
    posts,
  });
}catch (error) {
  res.status(400).json({ error: error.message });
}
});



// Post 상세 보기 
router.get('/detail/:postId', authMiddlewares, async (req, res) => {
  try {
    const { postId } = req.params;
    const detail = await Post.findOne({ postId: Number(postId) });
    const comment = res.locals.comment.comment;
    const commentDate = res.locals.comment.commentDate;
    const userNickname = existingUser.userNickname;
    const userProfileImage = detail.userProfileImage;
    const existingUser = await User.findOne({ _id: userId });
    const authorId = existingUser._id;

    res.status(200).json({
      detail,
      comment,
      commentDate,
      userNickname,
      userProfileImage,
      authorId,
      postId,
      message: "상세페이지 보기 성공"
  });
} catch (err) {
  res.status(400).json({
    errorMessage: "상세페이지 보기 실패",
  });
  console.log("Post 상세페이지 보기 실패: " + err);
}
});

//Post 작성
router.post("/write", authMiddlewares, async (req, res) => {
  const { userId } = res.locals.user;
  const existingUser = await User.findOne({ _id: userId });
  const { postCategory, postTitle, postImage, postAddress, postOrderTime, postContent} = req.body;
  const postDate = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, "");
  const postTime = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, "");
  const userNickname = existingUser.userNickname;
  const authorId = existingUser._id;
  const commentAll = 0;
  // const userProfileImage = users.userProfileImage;
  try {
    const createPost = await Post.create({ 
    postId, 
    postCategory, 
    postTitle,
    postImage,
    postAddress,
    postOrderTime,
    postContent,
    postDate,
    postTime,
    userNickname,
    authorId,
    commentAll,
 });
    const postId = createPost.postId;

    res.status(200).json({
      postId,
      message: "Post생성 성공"
    });
  } catch (err) {
    res.status(400).json({
      errorMessage: "Post생성 실패"
    });
  }
});


module.exports = router;

// 포스트 수정 :

router.put('/edit/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const {
    postCategory,
    postTitle,
    postImage,
    postAddress,
    postOrderTime,
    postContent,
  } = req.body;
  const existingPost = await Post.find({ postId: parseInt(postId) });

  if (userId !== existingPost.authorId) {
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
});

// 포스트 삭제 : 유저확인,삭제되는 포스트와 같은 postId값 가진 댓글들도 삭제
router.delete('/post/:postId', authMiddlewares, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const existingPost = await Post.find({ postId: parseInt(postId) });
  if (userId !== existingPost.authorId) {
    res.status(400).json({ success: false, message: '내 게시물이 아닙니다' });
  } else {
    await Post.deleteOne({ postId: parseInt(postId) });
    await Comment.deleteMany({ postId: parseInt(postId) });
    res.status(200).json({ success: true, message: '게시물 삭제 성공' });
  }
});

module.exports = router;
