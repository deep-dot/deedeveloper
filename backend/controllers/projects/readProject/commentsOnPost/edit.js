const BlogPost = require('../../../../models/BlogPost.js')

// edit comment,
module.exports = async (req, res) => {
  //console.log('commenton project in comments.js',req.body.commentId, req.params.id);

  if (!req.isAuthenticated()) { // Check if the user is logged in
    // return res.json({ status: 'error', message: 'Please login to access this resource', redirect: '/auth/login' });
    return res.redirect('/auth/login');
 }
 
  await BlogPost.updateOne({ _id: req.params.id, 'comments._id': req.body.commentId }, { $set: { 'comments.$.content': req.body.content } })
  //return res.json({success: true})
  return res.redirect(`/project/${req.params.id}`);
};

