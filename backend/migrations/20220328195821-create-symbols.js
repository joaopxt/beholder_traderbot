"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("symbols", {
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      basePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quotePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      minNotional: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      minLotSize: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isFavorit: {
        //o que custava eu ter escrito certo
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("symbols");
  },
};