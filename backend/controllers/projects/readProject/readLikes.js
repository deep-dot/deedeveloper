const BlogPost = require('../../../models/BlogPost.js')
const User = require('../../../models/User.js')

module.exports =  async (req, res) => {
    // console.log('accessed==',req.params.id)
    var user = "";
    if (req.user) {
        user = await User.findById(req.user._id).lean();
    }
    const post = await BlogPost.findById(req.params.id).lean();
    res.json({
        post: post,
        user: user
    });
};