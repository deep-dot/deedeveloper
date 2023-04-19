
const BlogPost = require('../../models/BlogPost.js')
const User = require('../../models/User.js')

module.exports = async (req, res) => {
    await BlogPost.findById(req.params.id).then(post => {
        // console.log(post)
        if (post == null) {
            res.json({
                "status": 'error',
                "message": "Post doest not exist."
            });
        } else {
            var isLiked = false;
            for (var i = 0; i < post.likers.length; i++) {
                var liker = post.likers[i];
                //console.log('res', liker.userid, req.user._id);
                if (JSON.stringify(liker.userid) == JSON.stringify(req.user._id)) {
                    isLiked = true;
                    break;
                }
            }
            // console.log('isLiked', isLiked);
            if (isLiked) {
                BlogPost.updateOne({
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
                        //console.log('data==', data);
                        User.updateOne({
                            $and: [{
                                "_id": post.userid
                            },
                            {
                                "postid": post._id
                            }]
                        }, {
                            $pull: {
                                "post.$[].likers": {
                                    "userid": req.user._id,
                                }
                            }
                        });
                        res.json({
                            "status": "unliked",
                            "message": "Post has been unliked."
                        });
                    }
                );
            } else {
                console.log('liked===', req.user._id)
                User.updateOne({
                    _id: req.user._id,
                }, {
                    $push: {
                        "notifications": {
                            "userid": req.user._id,
                            "title": "Post_liked",
                            "content": req.user.username || req.user.displayName + "has liked your review.",
                           // "profileImage": req.user.image,
                           // "createdAt": new Date().getTime()
                        }
                    }
                }, {
                    new: true,
                });
                BlogPost.updateOne({
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
                    User.updateOne({
                      $and: [{
                        "_id": post.userid
                      },
                      {
                        "postid": post._id
                      }
                      ]
                    }, {
                      $push: {
                        "post.$[].likers": {
                          "_id": req.user._id,
                          "name": req.user.displayName || req.user.username,
                        //  "profileImage": req.user.image
                        }
                      }
                    });
                    res.json({
                        "status": "success",
                        "message": "Post has been liked."
                    });
                });
            }
        }
    });
}


