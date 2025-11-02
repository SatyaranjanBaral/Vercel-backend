import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

/* ============================================================
   📌 Get Single User by ID
============================================================ */
export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Get All Users
============================================================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Update User
============================================================ */
export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Delete User
============================================================ */
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Get User Profile (From Authenticated Token)
============================================================ */
export const getUserProfile = async (req, res) => {
  try {
    // ✅ ID extracted from middleware (authVerify)
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Get My Appointments (Bookings of Logged-in User)
============================================================ */
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Comes from JWT auth middleware

    // Fetch all bookings related to this user
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "doctor",
        select: "name specialization photo experience fees", // doctor fields
      })
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};
