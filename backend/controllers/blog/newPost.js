
module.exports = async (req, res) => {
    res.render('pages/blog/create.ejs', {
        style: 'blog/createPost.css',
        bodyId:'BlogPage',
        error: res.locals.error,
        success: res.locals.success
    });
}

