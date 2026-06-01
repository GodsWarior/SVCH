const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM('new', 'confirmed', 'packing', 'delivering', 'completed', 'cancelled'),
    defaultValue: 'new',
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  deliverySlot: { type: DataTypes.STRING(80) },
}, { tableName: 'orders', underscored: true });
