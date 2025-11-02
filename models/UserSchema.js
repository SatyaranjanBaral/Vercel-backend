import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  gender: { type: String },
  role: { type: String, enum: ["patient"], default: "patient" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
