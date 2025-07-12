const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middlewares/auth.middleware');
const blogController = require('../controllers/blog.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/list', auth, blogController.list);
router.post('/getone', auth, blogController.getOne);
router.post('/save', auth, blogController.save);
router.post('/remove', auth, blogController.remove);
router.post('/upload', auth, upload.single('file'), blogController.upload);

module.exports = router;
