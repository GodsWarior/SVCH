const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { getUsers, updateUserRole, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, requireRole('admin'), getUsers);
router.patch('/:id/role', auth, requireRole('admin'), updateUserRole);
router.put('/:id', auth, requireRole('admin'), updateUser);

module.exports = router;
