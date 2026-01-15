import Service from "../models/Service.js";

export const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};
