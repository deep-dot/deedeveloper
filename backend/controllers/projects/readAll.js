const BlogPost = require('../../models/BlogPost.js');

module.exports = async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const blogposts = await BlogPost.find({}); 

        // Render the page with fetched blog posts
        res.render('pages/projects/readAll.ejs', {
            style: 'projects/readAll.css',
            bodyId: 'BlogPage',
            blogposts, // Pass the blog posts to the view
            userExist: req.user ? true : false, // Example check for user authentication (update as needed)
            userid: req.user ? req.user._id : null, // Example user ID (update as needed)
            error: res.locals.error,
            success: res.locals.success
        });
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        res.status(500).render('pages/error.ejs', {
            error: 'Failed to fetch blog posts. Please try again later.'
        });
    }
};
