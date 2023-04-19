module.exports = async(req, res) => {

    res.render('process.ejs', {
        style: 'process.css',
        bodyId: 'ProcessPage'
    });
}