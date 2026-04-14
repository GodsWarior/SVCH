const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');

// CRUD операции
router.get('/', courierController.getAll);
router.get('/all', courierController.getAllSorted);
router.get('/filtered', courierController.getAllFiltered);
router.get('/search', courierController.search);
router.get('/:id', courierController.getById);
router.get('/:id/exists', courierController.exists);
router.get('/:id/with-orders', courierController.getWithOrders);

// Специальный маршрут для получения всех курьеров с заказами
router.get('/with-orders/all', courierController.getAllWithOrders);

router.post('/', courierController.create);
router.put('/:id', courierController.update);
router.delete('/:id', courierController.delete);

module.exports = router;

