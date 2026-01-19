import Car from '../models/Car.js';

export const createCar = async (req, res) => res.json(await Car.create(req.body));
export const getCars = async (req, res) => res.json(await Car.find());
export const getCar = async (req, res) => res.json(await Car.findById(req.params.id));
export const updateCar = async (req, res) => res.json(await Car.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteCar = async (req, res) => res.json(await Car.findByIdAndDelete(req.params.id));
