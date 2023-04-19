const BlogPost = require('../../models/BlogPost.js')
const path = require('path');
const cloudinary = require("cloudinary").v2;

module.exports = async (req, res) => {
  // console.log("req.file=",req.file, loggedIn);
  // if (req.body.post === "" || req.body.post === undefined || !req.body.post || req.body.post == null) {
  //   //return res.json({success: 'write message'});
  //   error = `Please write post`;
  //   req.flash('error', error);
  //   return res.redirect('/posts/new');
  // }
  // if (req.file === "" || req.file === undefined || !req.file || req.file == null) {
  //   //return res.json({success: 'select image'});
  //   error = `Please select image`;
  //   req.flash('error', error);
  //   return res.redirect('/posts/new');
  // }
  //var path = "/" + req.file.path.split('/').slice(1).join('/');
  var path = '';
  if (req.file) {
     path = req.file.path;
  }
  const post = await BlogPost.create({
    ...req.body,
    image: path,
    userid: req.user._id,
    username: req.user.username || req.user.displayName,
    createrImage: req.user.image,
    // ...req.body, userid: req.user._id, username: req.user.username || req.user.displayName
  });
  if (post) {
    //return res.json({success: 'created successfully'});
    success = `Post has been created successfully`;
    req.flash('success', success);
    return res.redirect('/blogs');
  } else {
    //return res.json({error: err});
    await cloudinary.uploader.destroy(req.file.filename);
    error = `Post unsuccessful`;
    req.flash('error', error);
    return res.redirect('/posts/new');
  }
}