const express = require('express');
const router = express.Router();
const { getProducts, createProduct, seedProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/seed', seedProducts);

module.exports = router;
