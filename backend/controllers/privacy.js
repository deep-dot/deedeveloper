module.exports = async(req, res) => {

    res.render('pages/privacy.ejs', {
        style: 'privacy.css',
        bodyId: 'privacyPage'
    });
}