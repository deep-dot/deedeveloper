
module.exports = async (req, res) => {

    res.render('home.ejs', {
        style: 'home/home.css, home/classH.css, home/classA.css, home/classS.css, home/classT.css, home/classF.css, home/classC.css, home/classM.css, home/why-me.css.',
        bodyId:'HomePage',        
    });
}