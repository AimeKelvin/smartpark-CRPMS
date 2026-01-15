
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./Car.js";

const Payment = sequelize.define("Payment", {
  PaymentNumber: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  AmountPaid: DataTypes.INTEGER,
  PaymentDate: DataTypes.DATEONLY,
});

Car.hasMany(Payment, { foreignKey: "PlateNumber" });
Payment.belongsTo(Car, { foreignKey: "PlateNumber" });

export default Payment;
