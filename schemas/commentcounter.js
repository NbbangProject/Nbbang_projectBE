const mongoose = require('mongoose');

const commentCounter = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    totalComment: {
      type: Number,
    },
  },
  { collection: 'commentcounter' }
);
module.exports = mongoose.model('CommentCounter', commentCounter);
