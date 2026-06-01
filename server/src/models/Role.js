const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
}, { tableName: 'roles', underscored: true });
