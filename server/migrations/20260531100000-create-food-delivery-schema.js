'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(160), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING(40) },
      role_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('addresses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      city: { type: Sequelize.STRING(80), allowNull: false },
      street: { type: Sequelize.STRING(140), allowNull: false },
      house: { type: Sequelize.STRING(20), allowNull: false },
      flat: { type: Sequelize.STRING(20) },
      comment: { type: Sequelize.TEXT },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(80), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(140), allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      image_url: { type: Sequelize.STRING },
      weight: { type: Sequelize.STRING(40) },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      is_popular: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      category_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'categories', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status: { type: Sequelize.ENUM('new', 'confirmed', 'packing', 'delivering', 'completed', 'cancelled'), defaultValue: 'new' },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      delivery_slot: { type: Sequelize.STRING(80) },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      address_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'addresses', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      order_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE' },
      product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('favorites', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('product_reviews', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      text: { type: Sequelize.TEXT },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      method: { type: Sequelize.ENUM('card', 'cash'), allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      order_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('product_reviews');
    await queryInterface.dropTable('favorites');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  },
};
