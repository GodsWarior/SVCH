const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { Role, User } = require('../models');
const { createToken, toPublicUser } = require('../utils/token');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const [role] = await Role.findOrCreate({ where: { name: 'customer' } });
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      RoleId: role.id,
    });
    const userWithRole = await User.findByPk(user.id, { include: Role });

    return res.status(201).json({ user: toPublicUser(userWithRole), token: createToken(userWithRole) });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({ user: toPublicUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
};

const getMe = (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};

const updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { name, email, phone } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    await req.user.update({ name, email, phone });
    const updated = await User.findByPk(req.user.id, { include: Role });
    return res.json({ user: toPublicUser(updated) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
};
