const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// const Review = mongoose.model('Review', {
const ReviewSchema = mongoose.Schema({
  username: String,
  image: String,
  review: String,
  stars: {
    type: Number
  },
  likers:[{
    name: String,
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
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
    }
  },
  {
    timestamps: true
  }],
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
},
  { timestamps: true });
//  ReviewSchema.plugin(uniqueValidator, { message: 'This {PATH} already existing.' });
// ReviewSchema.plugin(uniqueValidator, { 
//    message: "Can't submit because you already had shared your views. Thank You." 
// });
//module.exports = Review;
module.exports = mongoose.model('Review', ReviewSchema);