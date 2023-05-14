
const BlogPost = require('../../models/BlogPost.js')
const User = require('../../models/User.js')

module.exports = async(req, res) => {
    var userid = "";
    var userExist = false;
    if(req.user) {        
        userid = req.user._id;
    }
    BlogPost.findById(req.params.id).lean().then(blogpost => {       
        console.log('blogpost useid and userid==', blogpost.userid, userid);
        if(blogpost.userid.toString() === userid.toString()) {
            userExist = true; 
            userid = req.user._id;
        }        
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