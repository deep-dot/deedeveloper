
module.exports = async (req, res) => {

    res.render('home.ejs', {
        style: 'home.css',
        bodyId:'HomePage',        
    })
}