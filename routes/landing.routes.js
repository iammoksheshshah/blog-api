const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landing.controller');

router.post('/blogs/list', landingController.getBlogListPaginated);
router.post('/blogs', landingController.getBlogListAll);
router.post('/blogs/getone', landingController.getBlogById);
router.post('/sitemap', landingController.getAllRoutes);

module.exports = router;
