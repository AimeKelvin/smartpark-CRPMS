import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => res.json(await Payment.create(req.body));
export const getPayments = async (req, res) => res.json(await Payment.find().populate({ path: 'record', populate: ['car','service'] }));
export const getPayment = async (req, res) => res.json(await Payment.findById(req.params.id).populate({ path: 'record', populate: ['car','service'] }));
export const updatePayment = async (req, res) => res.json(await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deletePayment = async (req, res) => res.json(await Payment.findByIdAndDelete(req.params.id));
