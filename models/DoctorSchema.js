import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  gender: { type: String },
  role: { type: String, enum: ["doctor"], default: "doctor" },
  specialization: { type: String },
  phone: { type: String },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  totalRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
