import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "crpms_db",
"root",
  "",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
