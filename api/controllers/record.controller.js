import ServiceRecord from '../models/ServiceRecord.js';

export const createRecord = async (req, res) => res.json(await ServiceRecord.create(req.body));
export const getRecords = async (req, res) => res.json(await ServiceRecord.find().populate('car service'));
export const getRecord = async (req, res) => res.json(await ServiceRecord.findById(req.params.id).populate('car service'));
export const updateRecord = async (req, res) => res.json(await ServiceRecord.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteRecord = async (req, res) => res.json(await ServiceRecord.findByIdAndDelete(req.params.id));
