import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Car = sequelize.define("Car", {
  PlateNumber: { type: DataTypes.STRING, primaryKey: true },
  Type: DataTypes.STRING,
  Model: DataTypes.STRING,
  ManufacturingYear: DataTypes.INTEGER,
  DriverPhone: DataTypes.STRING,
  MechanicName: DataTypes.STRING,
});

export default Car;
