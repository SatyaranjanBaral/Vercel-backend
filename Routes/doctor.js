import express from "express";
import {
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile, // ✅ Added this import
} from "../Controllers/doctorController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// 🔹 Nested route for reviews of a specific doctor
router.use("/:doctorId/reviews", reviewRouter);

// 🔹 Public Routes
router.get("/", getAllDoctors);
router.get("/:id", getSingleDoctor);

// 🔹 Protected Routes
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/:id", authenticate, restrict(["admin"]), deleteDoctor);

// 🔹 Get Doctor Profile (From JWT token)
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;
