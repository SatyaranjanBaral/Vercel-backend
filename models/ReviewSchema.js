import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * ✅ Static method to calculate average rating of a doctor
 */
reviewSchema.statics.calcAverageRating = async function (doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: doctorId } },
    {
      $group: {
        _id: "$doctor",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      totalRating: stats[0].avgRating,
      numReviews: stats[0].numReviews,
    });
  } else {
    // If no reviews remain, reset values
    await Doctor.findByIdAndUpdate(doctorId, {
      totalRating: 0,
      numReviews: 0,
    });
  }
};

/**
 * ✅ Call calcAverageRating after save
 */
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.doctor);
});

/**
 * ✅ Call calcAverageRating after delete
 */
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRating(this.doctor);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
