const BlogPost = require('../../models/BlogPost.js')

module.exports = async (req, res) => {
    var name = "";
    const blogposts = await BlogPost.find({});
    res.render('blog/blogs.ejs', {
        style: 'blog.css',
        bodyId:'BlogPage',
        blogposts,
        error: res.locals.error,
        success: res.locals.success
    });
}