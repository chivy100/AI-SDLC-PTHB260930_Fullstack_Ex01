const express = require('express');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

// [GET] /api/categories - Lấy danh sách thể loại
router.get('/', categoryController.getCategories);

module.exports = router;
