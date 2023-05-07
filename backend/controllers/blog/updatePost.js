

const BlogPost = require('../../models/BlogPost.js');

module.exports = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  const newPostData = {
    title: req.body.title,
    post: req.body.post,
    image: post.image // keep the current image if the user doesn't select a new one
  };

  if (req.file) {
    newPostData.image = req.file.path; // update the image if the user selects a new one
  }

  try {
    await BlogPost.findByIdAndUpdate(req.params.id, newPostData, {
      new: true,
    });
    success = `Post updated successfully`;
    req.flash('success', success);
    res.redirect("/blogs");
  } catch (e) { console.log(e); }
}