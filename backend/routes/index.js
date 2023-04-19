const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const homeController = require('../controllers/home')
const newPostController = require('../controllers/crudpost/newPost')
const storePostController = require('../controllers/crudpost/storePost')
const toggleLikePostController = require('../controllers/crudpost/likePost')
const getPostLikesController = require('../controllers/crudpost/getPostLikes')
const blogsController = require('../controllers/crudpost/blogs')
const getPostController = require('../controllers/crudpost/getPost')
const deletepostController = require('../controllers/crudpost/deletePost')
const editpostController = require('../controllers/crudpost/editPost')
const updatePostController = require('../controllers/crudpost/updatePost')
const searchPostController = require('../controllers/crudpost/searchPost')
const processController = require('../controllers/process')
const privacyPostController = require('../controllers/privacy')
const faqPostController = require('../controllers/faq')

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

router.get('/blogs', blogsController);
router.post('/searchPost', searchPostController);
router.get('/posts/new', ensureAuth, newPostController)
router.post('/posts/store', upload, storePostController);
router.post('/toggleLikePost/:id', toggleLikePostController);
router.get('/getPostLikes/:id', getPostLikesController);
router.get('/post/:id',  getPostController);
router.delete('/post/:id', ensureAuth, deletepostController);
router.get('/post/:id/edit',ensureAuth, editpostController);
router.put('/post/:id', ensureAuth, upload, updatePostController);

router.get('/privacy', privacyPostController);
router.get('/process', processController);
router.get('/faq', faqPostController);

module.exports = router