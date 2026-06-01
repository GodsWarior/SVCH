const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('ProductReview', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT },
}, { tableName: 'product_reviews', underscored: true });
