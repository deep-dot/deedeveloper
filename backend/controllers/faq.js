module.exports = async(req, res) => {

    res.render('pages/faq.ejs', {
        style:'faq.css',
        bodyId: 'faqPage'
    });
}