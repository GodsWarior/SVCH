const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city: { type: DataTypes.STRING(80), allowNull: false },
  street: { type: DataTypes.STRING(140), allowNull: false },
  house: { type: DataTypes.STRING(20), allowNull: false },
  flat: { type: DataTypes.STRING(20) },
  comment: { type: DataTypes.TEXT },
}, { tableName: 'addresses', underscored: true });
