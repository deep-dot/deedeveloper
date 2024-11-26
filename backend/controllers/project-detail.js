module.exports = async(req, res) => {

    res.render('pages/components/projects/project-detail.ejs', {
        style:'project-detail.css',
        bodyId: 'project-detail'
    });
}