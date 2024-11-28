
const BlogPost = require('../../models/BlogPost.js')

module.exports = async (req, res) => {
    var img = "";
    if (req.user) {
        img = req.user.image || null;
    }
    const blogpost = await BlogPost.findById(req.params.id).then((blogpost) => {
        if (blogpost) {
            // if (blogpost.userid === req.user._id) {
                if (blogpost.userid.toString().trim() === req.user._id.toString().trim()) {
              //  console.log('editpost===', blogpost);
                res.render('pages/projects/edit.ejs', {
                    style: 'projects/create.css',
                    bodyId: 'editProject',
                    blogpost,
                    img
                });
            } else {
                error = `Sorry, this post does not belong to you.`;
                req.flash('error', error);
                return res.redirect(`/project/${req.params.id}`);
            }
        }
    });
}