const { Role, User } = require('../models');
const { toPublicUser } = require('../utils/token');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ include: [Role], order: [['createdAt', 'DESC']] });
    return res.json(users.map(toPublicUser));
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const role = await Role.findOne({ where: { name: req.body.role } });
    const user = await User.findByPk(req.params.id);
    if (!role || !user) return res.status(404).json({ message: 'User or role not found' });
    await user.update({ RoleId: role.id });
    const updated = await User.findByPk(user.id, { include: Role });
    return res.json(toPublicUser(updated));
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.Role?.name === 'admin') {
      return res.status(403).json({ message: 'Admin users cannot be edited here' });
    }

    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    if (req.body.role) {
      const role = await Role.findOne({ where: { name: req.body.role } });
      if (!role) return res.status(404).json({ message: 'Role not found' });
      updates.RoleId = role.id;
    }

    await user.update(updates);
    const updated = await User.findByPk(user.id, { include: Role });
    return res.json(toPublicUser(updated));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  updateUser,
};
