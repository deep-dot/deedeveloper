
module.exports = async(req, res) => {
    res.render('pages/process.ejs', {
        style: 'process.css',
        bodyId: 'processPage'
    });
}