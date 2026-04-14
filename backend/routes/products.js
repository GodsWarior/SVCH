const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD операции
router.get('/', productController.getAll);
router.get('/all', productController.getAllSorted);
router.get('/filtered', productController.getAllFiltered);
router.get('/search', productController.search);
router.get('/:id', productController.getById);
router.get('/:id/exists', productController.exists);
router.get('/:id/with-order-items', productController.getWithOrderItems);
router.get('/:id/statistics', productController.getStatistics);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;

