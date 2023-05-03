const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  username: String,
  image: String,
  review: String,
  stars: {
    type: Number
  },
  likers: [{
    name: String,
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  // comments: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Comment',
  // }],
  comments: [{
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
    createdOn: String
  }],
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
},
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);


