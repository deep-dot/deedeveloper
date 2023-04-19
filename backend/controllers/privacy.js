module.exports = async(req, res) => {

    res.render('privacy.ejs', {
        style: 'privacy.css',
        bodyId: 'privacyPage'
    });
}