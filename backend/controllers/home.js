module.exports = async (req, res) => {
    res.render('pages/index.ejs', {
        // style: 'home/common.css, home/home.css, home/about.css, home/services.css, home/testimonials.css, home/faq.css, home/contact.css, home/map.css, home/whyme.css',
        style: 'home/common.css, home/home.css, home/about.css, home/faq.css, home/contact.css, home/map.css',
        bodyId: 'HomePage'
    });
};
