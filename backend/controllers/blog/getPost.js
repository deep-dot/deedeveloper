
const BlogPost = require('../../models/BlogPost.js')
const User = require('../../models/User.js')

module.exports = async(req, res) => {
    var userid = "";
    var userExist = false;
    if (req.user) {
        userExist = true; 
        userid = req.user._id;
    }
   // console.log('post id ===',req.params.id )
    BlogPost.findById(req.params.id).lean().then(blogpost => {       
        res.render('pages/blog/post.ejs', {
            style: 'blog/post.css',
            bodyId: 'BlogPage',
            blogpost,  
            userExist,          
            userid,
            error: res.locals.error,
            success: res.locals.success
        });
    }).catch((err) => {
        console.log(err.message)
    });


}