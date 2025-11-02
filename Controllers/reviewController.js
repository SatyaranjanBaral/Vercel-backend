import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

/**
 * ✅ Get all reviews
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("doctor", "name specialization")
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

/**
 * ✅ Create a new review (patient only)
 */
export const createReview = async (req, res) => {
  const { doctorId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    // ✅ Validation
    if (!doctorId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, rating, and review text are required.",
      });
    }

    // ✅ Automatically get logged-in user's ID from token
    const userId = req.userId;

    // ✅ Create new review document
    const newReview = new Review({
      doctor: doctorId,
      user: userId,
      rating,
      reviewText,
    });

    // ✅ Save review
    const savedReview = await newReview.save();

    // ✅ Add review reference to Doctor model
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { reviews: savedReview._id },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: savedReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};
