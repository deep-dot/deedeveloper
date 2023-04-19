const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  username: String,
  post: String,
  createrImage: String,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
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
    content: String,
    commenterImage: String,    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogPost',
    },
    datePosted: {
      type: Date,
      default: new Date()
    },
  },
  {
    timestamps: true
  }],
}, {
  timestamps: true
})
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost

