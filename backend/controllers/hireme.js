module.exports = async(req, res) => {

    res.render('pages/hireme.ejs', {
        style: '/hireme.css',
        bodyId: 'hireme'
    });
}