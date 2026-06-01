const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING(40) },
}, { tableName: 'users', underscored: true });
