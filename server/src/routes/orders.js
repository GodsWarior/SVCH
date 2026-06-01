const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.get('/', auth, getOrders);
router.post('/', auth, createOrder);
router.patch('/:id/status', auth, requireRole('admin'), updateOrderStatus);

module.exports = router;
