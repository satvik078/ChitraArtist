import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    week: {
      type: String,
      required: true,
      unique: true,
      index: true, // Format: "2024-W15" (year-week number)
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "active",
    },
    leaderboard: [
      {
        artistId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artist",
          required: true,
        },
        totalScore: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        artworkCount: { type: Number, default: 0 },
        rank: { type: Number },
        artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Art" }],
      },
    ],
    topArtworks: [
      {
        artworkId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Art",
        },
        score: { type: Number },
        rank: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
competitionSchema.index({ week: 1, status: 1 });
competitionSchema.index({ "leaderboard.rank": 1 });

export default mongoose.model("Competition", competitionSchema);

