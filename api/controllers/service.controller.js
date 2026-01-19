import Service from '../models/Service.js';

export const createService = async (req, res) => res.json(await Service.create(req.body));
export const getServices = async (req, res) => res.json(await Service.find());
export const getService = async (req, res) => res.json(await Service.findById(req.params.id));
export const updateService = async (req, res) => res.json(await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteService = async (req, res) => res.json(await Service.findByIdAndDelete(req.params.id));
