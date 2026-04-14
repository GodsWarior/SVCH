const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// CRUD операции
router.get('/', orderController.getAll);
router.get('/all', orderController.getAllSorted);
router.get('/filtered', orderController.getAllFiltered);
router.get('/search', orderController.search);
router.get('/:id', orderController.getById);
router.get('/:id/exists', orderController.exists);

// Специальные маршруты для детальной информации
router.get('/detailed/all', orderController.getAllDetailed);
router.get('/:id/detailed', orderController.getDetailed);
router.get('/status/:status', orderController.getByStatus);

router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

module.exports = router;

