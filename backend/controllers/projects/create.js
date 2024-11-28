const BlogPost = require('../../models/BlogPost.js')
const path = require('path');
const cloudinary = require("cloudinary").v2;

module.exports = async (req, res) => {

  console.log('created===',req.body);
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
    return res.redirect('/readAll');
  } else {
    //return res.json({error: err});
    await cloudinary.uploader.destroy(req.file.filename);
    error = `Post unsuccessful`;
    req.flash('error', error);
    return res.redirect('/pageForCreation');
  }
}