import mongoose from "mongoose";

const artSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true, // For faster queries
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    category: {
      type: String,
      enum: ["sketch", "painting", "digital", "photography", "other"],
      default: "other",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPrintAvailable: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    // AI Scoring fields for competition
    aiScore: {
      overall: { type: Number, default: 0, min: 0, max: 100 },
      aesthetic: { type: Number, default: 0, min: 0, max: 100 },
      technical: { type: Number, default: 0, min: 0, max: 100 },
      creativity: { type: Number, default: 0, min: 0, max: 100 },
      composition: { type: Number, default: 0, min: 0, max: 100 },
      scoredAt: { type: Date },
      scoringVersion: { type: String, default: "1.0" },
    },
    // Competition tracking
    competitionWeek: String, // Format: "2024-W15" (year-week number)
    rankThisWeek: { type: Number, default: null },
    totalScoreThisWeek: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by artist
artSchema.index({ artistId: 1, createdAt: -1 });

export default mongoose.model("Art", artSchema);