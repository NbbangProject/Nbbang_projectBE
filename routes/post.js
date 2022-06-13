const router = require('express').Router();
const Comment = require('../schemas/comments');
const Post = require('../schemas/posts');
const authMiddlewares = require('../middlewares/authconfirm');

// Post 전체 정보 불러오기
router.get("/", async (req, res) => {
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
router.get("/detail/:postId",  async (req, res) => {
  try {
    const { postId } = req.params;
    const detail = await detail.find({ postId: postId });
    
    res.status(200).json({
      ok: true,
      detail,
      message: "Post 상세페이지 보기 성공"
  });
} catch (err) {
  res.status(400).json({
    ok: false,
    errorMessage: "Post 상세페이지 보기 실패",
  });
  console.log("Post 상세페이지 보기 실패: " + err);
}
});

//게시글 작성
router.post("/write", authMiddleware, async (req, res) => {
  const userImage  = res.locals.users.postImage
  const postNickname  = res.locals.users.postNickname
  const userId = res.locals.users.userId 
  // const comment_cnt = 0;

  try {
    // const result = await Post.create({ userId, nickname, userIcon, content, imgUrl, date, comment_cnt });
    // const postId = result.postId;

    res.status(200).json({
      postId,
      ok: true,
      message: "생성 성공"
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      errorMessage: "생성 실패"
    });
  }
});

module.exports = router;

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
