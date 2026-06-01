const jwt = require('jsonwebtoken');

const createToken = (user) => jwt.sign(
  { id: user.id, role: user.Role?.name },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '7d' },
);

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.Role?.name,
});

module.exports = { createToken, toPublicUser };
