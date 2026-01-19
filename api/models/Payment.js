import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  record: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRecord', required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
