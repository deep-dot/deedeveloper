

const BlogPost = require('../../../../models/BlogPost.js')

module.exports = async (req, res) => {
  //console.log(req.params.id, req.body.postId)

  if (!req.isAuthenticated()) { // Check if the user is logged in
    // return res.json({ status: 'error', message: 'Please login to access this resource', redirect: '/auth/login' });
    return res.redirect('/auth/login');
 }

  await BlogPost.updateOne(
    { _id: req.body.postId },
    { $pull: { comments: { _id: req.params.id } } },
  ).lean();
  // console.log(post)
  res.redirect(`/project/${req.body.postId}`);

}

