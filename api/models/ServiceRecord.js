import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','in_progress','completed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('ServiceRecord', recordSchema);
