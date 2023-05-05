module.exports = async(req, res) => {

    res.render('pages/components/why-me/projects/project-detail.ejs', {
        style:'project-detail.css',
        bodyId: 'projectDetailPage'
    });
}