
const BlogPost = require('../../../../models/BlogPost.js')

module.exports = async (req, res) => {
    console.log('comment on project in controllers',req.body, req.body.postId);

    if (!req.isAuthenticated()) { 
        return res.json({ status: 'error', message: 'Please login to access this resource', redirect: '/auth/login' });
    }
    const new_comment = {
        postId: req.params.id,
        commenterImage: req.user.image,
        userId: req.user.id,
        content: req.body.content,
        username: req.user.username || req.user.displayName
    };
   
    await BlogPost.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: new_comment } },
        { new: true }
    );
    return res.redirect(`/project/${req.params.id}`);
};

