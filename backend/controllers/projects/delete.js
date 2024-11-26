
const BlogPost = require('../../models/BlogPost.js')
const User = require('../../models/User.js')

module.exports = async (req, res) => {
  BlogPost.findById(req.params.id, (err, post) => {    
      if (post.userid.toString().trim() === req.user._id.toString().trim()) {
      BlogPost.deleteOne(post).then(() => {
        return res.redirect('/readAll');
      });
    } else {      
      error = `Sorry, this post does not belong to you.`;
      req.flash('error', error);
      return res.redirect('/post/id');      
    }
  });
}