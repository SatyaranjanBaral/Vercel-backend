import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

// ✅ Middleware: Authenticate user (for both doctors and patients)
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Access denied.",
      });
    }

    // ✅ Attach userId & role from token payload
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

// ✅ Middleware: Restrict access based on role
export const restrict = (roles) => async (req, res, next) => {
  try {
    const userId = req.userId;
    const role = req.role;

    if (!userId || !role) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }

    // ✅ Check if user exists in DB
    let user =
      (await User.findById(userId)) || (await Doctor.findById(userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Verify if user's role is allowed
    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You're not authorized to access this resource.",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Restrict Middleware Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error in role restriction.",
    });
  }
};
