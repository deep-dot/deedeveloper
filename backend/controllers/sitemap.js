
module.exports = async (req, res) => {

    res.render('pages/sitemap.ejs', {
        style: 'sitemap.css',
        bodyId:'sitemap',        
    });
}