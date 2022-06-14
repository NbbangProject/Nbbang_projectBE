const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postsSchema = new mongoose.Schema({
  postId: {
    type: Number,
    // required: true,
    // unique: true,
  },
  postCategory: {
    type: String,
    // required: true,
  },
  postTitle: {
    type: String,
    // required: true,
  },
  postImage: {
    type: String,
    // required: true,
  },
  postAddress: {
    type: String,
    // required: true,
  },
  postOrderTime: {
    type: String,
    // required: true,
  },
  postOrderDate: {
    type: String,
  },
  postContent: {
    type: String,
    // required: true,
  },
  postDate: {
    type: String,
    // required: true,
  },
  postTime: {
    type: String,
    // required: true,
  },
  userNickname: {
    type: String,
    // required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    // required: true,
  },
  commentAll: {
    type: Number,
    // required: true,
    default: 0,
  },
});
postsSchema.plugin(AutoIncrement, { inc_field: 'postId' });
module.exports = mongoose.model('Posts', postsSchema);
