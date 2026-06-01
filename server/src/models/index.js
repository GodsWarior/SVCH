const sequelize = require('../config/database');

const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Address = require('./Address')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Favorite = require('./Favorite')(sequelize);
const ProductReview = require('./ProductReview')(sequelize);
const Payment = require('./Payment')(sequelize);

Role.hasMany(User, { foreignKey: { allowNull: false } });
User.belongsTo(Role);

User.hasMany(Address, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Address.belongsTo(User);

Category.hasMany(Product, { foreignKey: { allowNull: false } });
Product.belongsTo(Category);

User.hasMany(Order, { foreignKey: { allowNull: false } });
Order.belongsTo(User);
Address.hasMany(Order, { foreignKey: { allowNull: false } });
Order.belongsTo(Address);

Order.hasMany(OrderItem, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem, { foreignKey: { allowNull: false } });
OrderItem.belongsTo(Product);

User.hasMany(Favorite, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Favorite.belongsTo(User);
Product.hasMany(Favorite, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Favorite.belongsTo(Product);

User.hasMany(ProductReview, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
ProductReview.belongsTo(User);
Product.hasMany(ProductReview, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
ProductReview.belongsTo(Product);

Order.hasOne(Payment, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Payment.belongsTo(Order);

module.exports = {
  sequelize,
  Role,
  User,
  Address,
  Category,
  Product,
  Order,
  OrderItem,
  Favorite,
  ProductReview,
  Payment,
};
