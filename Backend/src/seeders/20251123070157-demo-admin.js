"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insert Organisation (MySQL does NOT support returning: true)
    await queryInterface.bulkInsert("Organisations", [
      {
        name: "Test Org",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Fetch last inserted organisation id (MySQL way)
    const [orgRows] = await queryInterface.sequelize.query(
      "SELECT id FROM Organisations ORDER BY id DESC LIMIT 1;"
    );

    const orgId = orgRows[0].id;

    // 3. Create hashed password for admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 4. Insert admin user
    await queryInterface.bulkInsert("Users", [
      {
        organisation_id: orgId,
        email: "admin@test.com",
        password_hash: hashedPassword,
        name: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Organisations", null, {});
  },
};
