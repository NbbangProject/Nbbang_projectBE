const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  comment: {
    type: String,
    required: true,
  },
  commentDate: {
    type: Date,
    required: true,
  },
  userNickname: {
    type: String,
    required: true,
  },
  userProfileImage: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model('Comments', commentsSchema);
