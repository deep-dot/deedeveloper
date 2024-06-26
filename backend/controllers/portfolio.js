module.exports = async(req, res) => {

    res.render('pages/components/about/portfolio/portfolio.ejs', {
        style: 'about/portfolio.css',
        bodyId: 'portfolioPage'
    });
}