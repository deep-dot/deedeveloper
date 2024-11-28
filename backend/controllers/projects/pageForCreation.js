
const BlogPost = require('../../models/BlogPost.js')

module.exports = async (req, res) => {
   // console.log('pageforcretion===');
    res.render('pages/projects/create.ejs', {
        style: 'projects/create.css',
        bodyId: ' '
    });
}