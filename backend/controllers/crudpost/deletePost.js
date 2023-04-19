
const BlogPost = require('../../models/BlogPost.js')
const User = require('../../models/User.js')

module.exports = async (req, res) => {
  BlogPost.findById(req.params.id, (err, post) => {    
    if (JSON.stringify(post.userid) === JSON.stringify(loggedIn._id)) {
      BlogPost.deleteOne(post).then(() => {
        return res.redirect('/blogs');
      });
    } else {      
      error = `Sorry, this post does not belong to you.`;
      req.flash('error', error);
      return res.redirect('/post/id');      
    }
  });
}