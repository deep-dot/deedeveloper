const BlogPost = require('../../models/BlogPost.js')

module.exports = async (req, res) => {
    var name = "";
    const blogposts = await BlogPost.find({});
    res.render('pages/blog/blogs.ejs', {
        style: 'blog/blog.css',
        bodyId:'BlogPage',
        blogposts,
        error: res.locals.error,
        success: res.locals.success
    });
}