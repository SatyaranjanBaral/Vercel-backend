import express from "express";
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
} from "../Controllers/userController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

/* ============================================================
   📌 USER ROUTES
============================================================ */

// ✅ Get single user (Patient only)
router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);

// ✅ Get all users (Admin only)
router.get("/", authenticate, restrict(["admin"]), getAllUsers);

// ✅ Update user (Patient only)
router.put("/:id", authenticate, restrict(["patient"]), updateUser);

// ✅ Delete user (Patient only)
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

// ✅ Get logged-in user profile (Patient)
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);

// ✅ Get logged-in user's appointments (Patient)
router.get("/appointments/my-appointments", authenticate, restrict(["patient"]), getMyAppointments);

export default router;
