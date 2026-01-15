import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./Car.js";
import Service from "./Service.js";

const ServiceRecord = sequelize.define("ServiceRecord", {
  RecordNumber: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ServiceDate: DataTypes.DATEONLY,
});

Car.hasMany(ServiceRecord, { foreignKey: "PlateNumber" });
Service.hasMany(ServiceRecord, { foreignKey: "ServiceCode" });

ServiceRecord.belongsTo(Car, { foreignKey: "PlateNumber" });
ServiceRecord.belongsTo(Service, { foreignKey: "ServiceCode" });

export default ServiceRecord;
