
module.exports = async (req, res) => {
    res.render('pages/whyme.ejs', {
        style: 'whyme.css',
        bodyId:'whyme',        
    });
}