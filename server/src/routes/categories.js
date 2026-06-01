const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, requireRole('admin'), createCategory);
router.put('/:id', auth, requireRole('admin'), updateCategory);
router.delete('/:id', auth, requireRole('admin'), deleteCategory);

module.exports = router;
