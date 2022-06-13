const mongoose = require('mongoose');

const commentCounter = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalComment: {
    type: Number,
  },
});
module.exports = mongoose.model('CommentCounter', commentCounter);
