const express = require('express');
const router = express.Router()
const { ensureAuth, ensureGuest, checkSessionExpiration } = require('../middleware/auth');

const homeController = require('../controllers/home'); 
const whyme = require('../controllers/whyme');
const hireme = require('../controllers/hireme');

const readAllController = require('../controllers/projects/readAll');
const pageForCreation = require('../controllers/projects/pageForCreation');
const createController = require('../controllers/projects/create');
const likeController = require('../controllers/projects/readProject/like');
const createCommentOnProject = require('../controllers/projects/readProject/commentsOnPost/create');
const editCommentOnProject = require('../controllers/projects/readProject/commentsOnPost/edit');
const deleteCommentOnProject = require('../controllers/projects/readProject/commentsOnPost/delete');

const readLikesController = require('../controllers/projects/readProject/readLikes');
const readController = require('../controllers/projects/readProject/readProject');
const deleteController = require('../controllers/projects/delete');
const editController = require('../controllers/projects/edit');
const updateProject = require('../controllers/projects/updateProject');
const searchController = require('../controllers/projects/search');

const processController = require('../controllers/process');
const privacyController = require('../controllers/privacy');
const faqController = require('../controllers/faq');
const sitemap = require('../controllers/sitemap');

const projectDetail = require('../controllers/project-detail');

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, ('./public/img/db_img'));
//   },
//   filename: function(req, file, cb) {
//      cb(null, new Date().toISOString() + file.originalname);
//   }
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AOPBlogPost",
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
}).single('image');

router.get('/', homeController);
router.get('/whyme', whyme);
router.get('/hireme', hireme);

router.get('/readAll', readAllController);
router.post('/search', searchController);
router.get('/pageForCreation', ensureAuth, pageForCreation);
router.post('/create', upload, createController)
router.get('/project/:id',  readController);

router.get('/readLikes/:id', readLikesController);
router.post('/like/:id', likeController);
router.put('/project/:id/comment', ensureAuth, createCommentOnProject);
router.put('/project/:id/commentEdit', editCommentOnProject);
router.delete('/project/:id/comment', deleteCommentOnProject);

router.delete('/project/:id', ensureAuth, deleteController);
router.get('/project/:id/edit',ensureAuth, editController);
router.put('/project/:id', upload, updateProject);

router.get('/privacy', privacyController);
router.get('/process', processController);
router.get('/faq', faqController);
router.get('/sitemap', sitemap);

router.get('/project-detail', projectDetail);

module.exports = router