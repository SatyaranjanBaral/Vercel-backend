import Doctor from "../models/DoctorSchema.js";
import "../models/ReviewSchema.js";
import "../models/AppointmentSchema.js";

/* ============================================================
   📌 Get Single Doctor by ID
============================================================ */
export const getSingleDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .select("-password")
      .populate("reviews")
      .populate("appointments");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Get All Doctors (With Optional Search Query)
============================================================ */
export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      })
        .select("-password")
        .populate("reviews")
        .populate("appointments");
    } else {
      doctors = await Doctor.find({})
        .select("-password")
        .populate("reviews")
        .populate("appointments");
    }

    res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully",
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Update Doctor
============================================================ */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Delete Doctor
============================================================ */
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Get Doctor Profile (From Authenticated Token)
============================================================ */
export const getDoctorProfile = async (req, res) => {
  try {
    // ✅ Doctor ID comes from JWT middleware
    const doctorId = req.userId;

    // Fetch doctor details
    const doctor = await Doctor.findById(doctorId)
      .select("-password")
      .populate("reviews")
      .populate("appointments");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor profile",
      error: error.message,
    });
  }
};
