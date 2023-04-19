
const Review = require('../models/review');
const User = require('../models/User');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const hb = require('handlebars');
hb.registerHelper('dateFormat', require('handlebars-dateformat'));
hb.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 < v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
hb.registerHelper('if', function (login, options) {
  login = login || global.loggedIn
  if (login) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
hb.registerHelper('for', function (from, to, incr, stars, block) {
  var accum = '';
  for (var i = from; i < to; i += incr)
    if (i < stars) {
      accum += `<i class="fa fa-star" style='color:orange; margin:5px; font-size:14px'></i>`
    } else {
      accum += `<i class="fa fa-star" style='color:grey; margin:5px; font-size:14px'></i>`
    }
  return accum;
});
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { json } = require('body-parser');

// router.get('/home', async (req, res) => {
//   let numOfReviews = await Review.countDocuments();
//  // console.log('numof reviews==',numOfReviews);
//   res.render('home.ejs', {
//     style: 'home.css',
//     bodyId: 'HomePage',
//     numOfReviews,
//     error: res.locals.error,
//     success: res.locals.success
//   });
//   // res.render('reviews/reviews-index.handlebars', {
//   //   style:'review-index.css',
//   //   bodyId:'ReviewPage',
//   //   error: res.locals.error,
//   //   success: res.locals.success
//   // });
// });

// Send JSON data
router.get('/getJsonData', async (req, res) => {
  const reviews = await Review.find();
  let userid = '';
  if (req.user) {
    userid = req.user._id;
  }
  return res.json({ reviews: reviews, userid: userid });
});

//new review
router.get('/reviews/new', ensureAuth, async (req, res) => {
  console.log('req.user.id===', req.user._id);
  const review = await Review.find({
    userid: req.user._id,
  }).lean();
  if (review != "") {
    const error = `You already had shared your views. Thank You.`;
    req.flash('error', error);
    return res.redirect('/');
  }
  res.render('reviews/reviews-new.handlebars', {
    style: 'review-index.css',
    title: "New Review",
    bodyId: 'ReviewPage',
    error: res.locals.error,
    name: req.user.username || req.user.displayName,
    email: req.user.email
  });
})

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

// EDIT 
// router.get('/reviews/:id/edit', ensureAuth, async (req, res) => {
//   const review = await Review.findById(req.params.id).lean();
//   if (review) {
//     //console.log('reviews..', review, req.user._id);
//     if (JSON.stringify(review.userid) === JSON.stringify(req.user.id)) {
//       res.render('reviews/reviews-edit.handlebars', {
//         style:'review-index.css',
//         review: review,
//         name: req.user.username,
//         email: req.user.email
//       });
//     } else {
//       const error = `Sorry, this Review does not belong to you.`;
//       req.flash('error', error);
//       res.redirect('/home');
//     }
//   } else {
//     const error = `Something wrong.`;
//     req.flash('error', error);
//     res.redirect('/home');
//   }
// })

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