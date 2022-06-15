const { boolean } = require('joi');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  userNickname: {
    type: String,
    // required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    // required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    // required: true,
  },
  regionGu: {
    type: String,
    // required: true,
  },
  regionDetail: {
    type: String,
    // required: true,
  },
  userProfileImage: {
    type: String,
    // required: true,
  },
  is_login: {
    type: boolean,
    // required: true,
    default: true,
  },
});

usersSchema.virtual('userId').get(function () {
  return this._id.toHexString();
});
usersSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Users', usersSchema);
