
const BlogPost = require('../../models/BlogPost.js');
const User = require('../../models/User.js')

module.exports = async (req, res) => {
    var { title } = req.body
    var user = "";
    var userExist = false;
    if (req.user) {
        user = await User.findById(req.user._id).lean();
    }
    await BlogPost.findOne({ title: { '$regex': title, '$options': 'i' } }).lean().then(searchedpost => {
        if(JSON.stringify(searchedpost.userid) === JSON.stringify(req.user._id)) {
            userExist = true;
        } 
        if (searchedpost) {
           // console.log('searchpostId===', searchedpost._id);
            res.render('pages/projects/post/post.ejs', {
                style: 'projects/post.css',
                bodyId: 'SearchPost',
                blogpost: searchedpost,
                user,
                userExist,
                error: res.locals.error,
                success: res.locals.success
            });
        } else {
            error = `Sorry, Blog does not exist under this title.`;
            req.flash('error', error);
            return res.redirect('/projects');
        }
    }).catch(err => {
        console.log(err.message)
    });;
}