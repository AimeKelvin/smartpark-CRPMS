import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  type: String,
  model: String,
  year: Number,
  driverPhone: String,
  mechanicName: String,
  image:  String
}, { timestamps: true });

export default mongoose.model('Car', carSchema);
