const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// CRUD операции
router.get('/', customerController.getAll);
router.get('/all', customerController.getAllSorted);
router.get('/filtered', customerController.getAllFiltered);
router.get('/search', customerController.search);
router.get('/:id', customerController.getById);
router.get('/:id/exists', customerController.exists);
router.get('/:id/with-orders', customerController.getWithOrders);
router.get('/:id/statistics', customerController.getStatistics);
router.get('/with-orders/all', customerController.getAllWithOrders);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);

module.exports = router;

