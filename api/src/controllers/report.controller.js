import sequelize from "../config/db.js";

export const dailyReport = async (req, res) => {
  const [results] = await sequelize.query(`
    SELECT PlateNumber, SUM(AmountPaid) AS TotalPaid
    FROM Payments
    GROUP BY PlateNumber
  `);

  res.json(results);
};
