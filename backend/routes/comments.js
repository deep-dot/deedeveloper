
const Review = require('../models/review');
const BlogPost = require('../models/BlogPost.js')
const User = require('../models/User.js')
const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Create and review comments,
router.post('/review/:id/comment', ensureAuth, async (req, res) => {
  const new_comment = {
    reviewId: req.params.id,
    userId: req.user.id,
    content: req.body.comment,
    username: req.user.username || req.user.displayName
  };
  //console.log('review', new_comment);
  await Review.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: new_comment } },
    { new: true }
  );
  res.redirect(`/review/${req.params.id}/comment`);
});

// Get comments with review
router.get('/review/:id/comment', ensureAuth, async (req, res) => {
  try {
    console.log('comment under review id===', req.params.id);
    const review = await Review.findById(req.params.id).lean();
    res.render('commentsInReview', {
      review: review,
      style: 'commentsInReview.css',
      bodyId: 'CreateReviewComment',
      name: req.user.username || req.user.displayName,
      email: req.user.email,
      error: res.locals.error
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE
router.delete('/deleteComment/:id', ensureAuth, async (req, res) => {
  if (req.user._id.equals(req.body.userId)) {
    console.log('matched');
    await Review.findByIdAndUpdate(
      req.body.reviewId,
      { $pull: { comments: { _id: req.params.id } } }
      // { $set: { "comments.$[].likes": 0 } },
    ).lean();
  } else {
    var error = `This comment does not belong to you.`;
    req.flash('error', error)
  }
  res.redirect(`/review/${req.body.reviewId}/comment`);
});



//----------------------------**********----------------------------------------------------------------



// Create and post comments,
router.put('/post/:id/comment', ensureAuth, async (req, res) => {
  console.log(req.body, req.params.id);
  const new_comment = {
    postId: req.params.id,
    commenterImage: req.user.image,
    userId: req.user.id,
    content: req.body.content,
    username: req.user.username || req.user.displayName
  };
  //console.log('post', new_comment);
  await BlogPost.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: new_comment } },
    { new: true }
  );
  //return res.json({success: true})
  return res.redirect(`/post/${req.params.id}`);
});

// edit comment,
router.put('/post/:id/commentEdit', ensureAuth, async (req, res) => {
  //console.log(req.body.commentId, req.params.id);
  await BlogPost.updateOne({ _id: req.params.id, 'comments._id': req.body.commentId }, { $set: { 'comments.$.content': req.body.content } })
  //return res.json({success: true})
  return res.redirect(`/post/${req.params.id}`);
});

// Get comments with post
// router.get('/post/:id/comment', async (req, res) => {
//   const post = await BlogPost.findById(req.params.id).lean();
//   res.render('posts/posts-show.ejs', {
//     post: post,
//     name: req.user.username,
//     email: req.user.email
//   });
// });

// DELETE
router.delete('/post/:id/comment', ensureAuth, async (req, res) => {
  console.log(req.params.id, req.body.postId)
  await BlogPost.updateOne(
    { _id: req.body.postId },
    { $pull: { comments: { _id: req.params.id } } },
  ).lean();
  // console.log(post)
  res.redirect(`/post/${req.body.postId}`);

})

module.exports = router;
