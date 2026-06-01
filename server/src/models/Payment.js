const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  method: { type: DataTypes.ENUM('card', 'cash'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'payments', underscored: true });
