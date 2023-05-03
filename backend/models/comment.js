
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    username: String,
    title: String,
    content: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('Comment', CommentSchema);