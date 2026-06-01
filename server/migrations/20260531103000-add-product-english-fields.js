'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'name_en', {
      type: Sequelize.STRING(140),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'description_en', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'description_en');
    await queryInterface.removeColumn('products', 'name_en');
  },
};
