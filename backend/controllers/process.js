module.exports = async(req, res) => {

    res.render('pages/process/process.ejs', {
        style: 'process.css',
        bodyId: 'ProcessPage'
    });
}