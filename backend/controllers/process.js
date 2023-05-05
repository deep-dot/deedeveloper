// module.exports = async(req, res) => {
//     res.render('pages/process/agile-process.ejs', {
//         style: 'process.css',
//         bodyId: 'ProcessPage'
//     });
// }

module.exports = async(req, res) => {
    res.render('pages/process/dev-process.ejs', {
        style: 'process.css',
        bodyId: 'ProcessPage'
    });
}