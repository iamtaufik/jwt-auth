const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/product');
// const handleRefresh = require('../controllers/refresh');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, getProducts);

module.exports = router;
