"use strict";
require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("../src/utils/crypto");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const settingsId = await queryInterface.rawSelect(
      "settings",
      { where: {}, limit: 1 },
      ["id"]
    );
    if (!settingsId) {
      return queryInterface.bulkInsert("settings", [
        {
          email: "joao.peixoto@bfcsa.com.br",
          password: bcrypt.hashSync("Bfc2022!"),
          apiUrl: "https://testnet.binance.vision/api/",
          accessKey:
            "rdXM2YlsIRjLAADFYjqMMLitzJypNYkO8YvtJF9emQW4JHU5C7g2LSzXm3raebtL",
          secretKey: crypto.encrypt(
            "HuB693AWlXqXOfaG644mXCLwdgChrRf71p3MLGl8NU065kThlwmGjJXdc8dYhHrM"
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("settings", null, {});
  },
};
