
const Review = require('../models/review');
const BlogPost = require('../models/BlogPost.js')
const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Create and review comments,
router.post('/review/:id/comment', async (req, res) => {
  //console.log('comment under review id in post route===', req.params.id);
  const new_comment = {
    reviewId: req.params.id,
    userId: req.user.id,
    content: req.body.comment,
    username: req.user.username || req.user.displayName,
    createdOn: new Date(),
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
    res.render('pages/components/review_comments', {
      review: review,
      style: 'review_comments.css',
      bodyId: 'review_comments',
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

module.exports = router;
