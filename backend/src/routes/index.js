const express = require('express');
const categoryRoutes = require('./category.routes');
const bookRoutes = require('./book.routes');

const router = express.Router();

// Mount các tuyến đường API
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);

module.exports = router;
