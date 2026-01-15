import Car from "../models/Car.js";

export const createCar = async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json(car);
};
