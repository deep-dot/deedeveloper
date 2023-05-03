
const Review = require('../models/review');
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Send JSON data
router.get('/getJsonData', async (req, res) => {
  const reviews = await Review.find();
  console.log('reviews===', reviews.length, reviews[0].comments);
  let userid = '';
  if (req.user) {
    userid = req.user._id;
  }
  return res.json({ reviews: reviews, userid: userid });
});


// create & save review
router.post('/reviews', ensureAuth, async (req, res) => {
  const { testimonial, Stars } = req.body;
  console.log('req.boby', req.body);
  if (Stars === "") {
    const error = `Please give us star rating. Thank you`;
    req.flash('error', error)
    return res.redirect('/#testimonial')
  }
  // if (!testimonial) {
  //   const error = `Please write review for us. Thank you`;
  //   req.flash('error', error)
  //   return res.redirect('/#testimonial')
  // }
  const user = await Review.findOne({ userid: req.user._id });
  if (user) {
    let error = `Can't submit because you already had shared your views. Thank You.`;
    //console.log("error===", err);
    req.flash('error', error)
    return res.redirect('/#testimonial');
  } else {
    await Review.create({
      ...req.body,
      username: req.user.username || req.user.displayName || "",
      image: req.user.image || "",
      review: testimonial || "",
      userid: req.user._id,
      stars: Stars || "",
    });
    success = `Thank you ${req.user.username || req.user.displayName} for sharing your views.`;
    req.flash('success', success);
    return res.redirect('/#testimonial');
  }
});

// UPDATE
router.put('/reviews/edit', async (req, res) => {
  console.log('update review', req.body)
  if (!req.body.stars) {
    const error = `Please give us star rating.`;
    req.flash('error', error);
    // return res.redirect(`/reviews/${req.body.reviewId}/edit`);
    return res.redirect('/#testimonial');
    //return res.json({success: false});
  }
  try {
    const review = await Review.findByIdAndUpdate(
      req.body.reviewId,
      req.body,
      { new: true }
    );
    if (review) {
      // console.log('update review===', review)
      return res.redirect('/#testimonial');
      //return res.json({success: true});
    }
  } catch (e) { console.log(e) };
})

//delete
router.delete('/reviews/:id', ensureAuth, async (req, res) => {
  const review = await Review.findById(req.params.id);
  //console.log('delete review',review)
  if (JSON.stringify(review.userid) === JSON.stringify(req.user._id)) {
    //await Comment.deleteMany({ reviewId: req.params.id });
    await review.remove();
    return res.redirect('/#testimonial');
  } else {
    const error = `Sorry, this Review does not belong to you.`;
    req.flash('error', error);
    res.redirect('/');
  }
});

router.post('/toggleLikeReview/:id', ensureAuth, async (req, res) => {
  await Review.findById(req.params.id).then(review => {
    var isLiked = false;
    for (var i = 0; i < review.likers.length; i++) {
      var liker = review.likers[i];
      // console.log('res', liker.userid, req.user._id);
      if (JSON.stringify(liker.userid) == JSON.stringify(req.user._id)) {
        isLiked = true;
        break;
      }
    }
    //console.log('isLiked', isLiked);
    if (isLiked) {
      Review.updateOne({
        _id: req.params.id,
      },
        {
          $pull: {
            "likers": {
              "userid": req.user._id,
            }
          }
        }, {
        new: true,
      },
        (err, data) => {
          // User.updateOne({
          //   $and: [{
          //     "_id": review.userid
          //   },
          //   {
          //     "reviewId": review._id
          //   }
          //   ]
          // }, {
          //   $pull: {
          //     "review.$[].likers": {
          //       "_id": req.user._id,
          //     }
          //   }
          // }
          // );
          res.json({
            "status": "unliked",
            "message": "Review has been unliked."
          });
        }
      );
    } else {
      User.updateOne({
        _id: req.user._id,
      }, {
        $push: {
          "notifications": {
            // "_id": req.user._id,
            "type": "review_liked",
            // "content": req.user.username || req.user.displayName + "has liked your review.",
            // "profileImage": req.user.image,
            // "createdAt": new Date().getTime()
          }
        }
      }, {
        new: true,
      });
      Review.updateOne({
        _id: req.params.id
      }, {
        $push: {
          "likers": {
            "userid": req.user._id,
            "name": req.user.displayName || req.user.username,
            "profileImage": req.user.image,
          }
        }
      }, {
        new: true,
      }, (err, data) => {
        // User.updateOne({
        //   $and: [{
        //     "_id": review.userid
        //   },
        //   {
        //     "reviewId": review._id
        //   }
        //   ]
        // }, {
        //   $pull: {
        //     "review.$[].likers": {
        //       "_id": req.user._id,
        //       "name": req.user.displayName || req.user.username,
        //       "profileImage": req.user.image
        //     }
        //   }
        // });
        res.json({
          "status": "success",
          "message": "Review has been liked."
        });
      });
    }
  });
});

module.exports = router