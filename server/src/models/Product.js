const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(140), allowNull: false },
  nameEn: { type: DataTypes.STRING(140) },
  description: { type: DataTypes.TEXT },
  descriptionEn: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  imageUrl: { type: DataTypes.TEXT },
  weight: { type: DataTypes.STRING(40) },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isPopular: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'products', underscored: true });
