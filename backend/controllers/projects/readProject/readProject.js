
const BlogPost = require('../../../models/BlogPost.js')
const User = require('../../../models/User.js')

module.exports = async (req, res) => {
   // console.log('readproject.js ==', req.params.id);
    await BlogPost.findById(req.params.id).lean().then(blogpost => {        
        res.render('pages/projects/post/post.ejs', {
            style: 'projects/post.css',
            bodyId: 'projectPage',
            blogpost,
            userExist: req.user ? true : false, 
            userid: req.user ? req.user._id : null, 
            error: res.locals.error,
            success: res.locals.success
        });
    }).catch((err) => {
        console.log(err.message)
    });
}
