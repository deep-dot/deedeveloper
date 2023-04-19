module.exports = async(req, res) => {

    res.render('faq.ejs', {
        style:'faq.css',
        bodyId: 'faqPage'
    });
}