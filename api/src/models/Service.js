import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Service = sequelize.define("Service", {
  ServiceCode: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ServiceName: DataTypes.STRING,
  ServicePrice: DataTypes.INTEGER,
});

export default Service;
