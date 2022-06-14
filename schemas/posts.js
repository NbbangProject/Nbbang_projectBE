const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const postsSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  postCategory: {
    type: String,
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: true,
  },
  postAddress: {
    type: String,
    required: true,
  },
  postOrderTime: {
    type: Date,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    required: true,
  },
  postTime: {
    type: Date,
    required: true,
  },
  userNickname: {
    type: String,
    required: true,
    unique: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  commentAll: {
    type: Number,
    required: true,
    default: 0,
  },
});
postsSchema.plugin(AutoIncrement, {inc_field: 'postId'});
module.exports = mongoose.model('Posts', postsSchema);
