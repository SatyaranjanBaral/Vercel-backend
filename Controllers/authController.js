import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

export const register = async (req, res) => {
  try {
    const { name, email, password, photo, gender, role } = req.body;

    // basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // check duplicates across both collections
    const existingUser = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    if (existingUser || existingDoctor) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // hash
    const hashed = await bcrypt.hash(password, 10);

    let created;
    if (role === "doctor") {
      created = new Doctor({ name, email, password: hashed, photo, gender, role });
    } else {
      created = new User({ name, email, password: hashed, photo, gender, role });
    }

    await created.save();

    // optionally return token
    const token = generateToken(created);

    return res.status(201).json({ success: true, message: "Registered", token, user: created });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    let user = await User.findOne({ email });
    if (!user) user = await Doctor.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ success: true, message: "Logged in", token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
