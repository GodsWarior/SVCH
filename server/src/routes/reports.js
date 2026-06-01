const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { downloadSalesReport, downloadStockReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/sales.pdf', auth, requireRole('admin'), downloadSalesReport);
router.get('/stock.docx', auth, requireRole('admin'), downloadStockReport);

module.exports = router;
