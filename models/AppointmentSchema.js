// models/AppointmentSchema.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
