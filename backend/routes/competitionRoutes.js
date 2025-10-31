import express from "express";
import Art from "../models/Art.js";
import Artist from "../models/Artist.js";
import Competition from "../models/Competition.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { getCurrentWeek, getWeekDates } from "../services/aiScoringService.js";

const router = express.Router();

// @route   GET /api/competition/current
// @desc    Get current week's competition and leaderboard
// @access  Public
router.get("/current", async (req, res) => {
  try {
    const currentWeek = getCurrentWeek();
    let competition = await Competition.findOne({ week: currentWeek });

    // Create competition if it doesn't exist
    if (!competition) {
      const { startDate, endDate } = getWeekDates(currentWeek);
      competition = await Competition.create({
        week: currentWeek,
        startDate,
        endDate,
        status: "active",
        leaderboard: [],
      });
    }

    // Populate artist info in leaderboard
    await competition.populate("leaderboard.artistId", "username displayName profileImage");

    res.json({
      success: true,
      competition: {
        week: competition.week,
        startDate: competition.startDate,
        endDate: competition.endDate,
        status: competition.status,
        leaderboard: competition.leaderboard.slice(0, 50), // Top 50
        topArtworks: competition.topArtworks.slice(0, 20), // Top 20 artworks
      },
    });
  } catch (error) {
    console.error("Get competition error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching competition",
    });
  }
});

// @route   GET /api/competition/leaderboard
// @desc    Get full leaderboard for current week
// @access  Public
router.get("/leaderboard", async (req, res) => {
  try {
    const currentWeek = getCurrentWeek();
    const competition = await Competition.findOne({ week: currentWeek });

    if (!competition) {
      return res.json({
        success: true,
        leaderboard: [],
        week: currentWeek,
      });
    }

    await competition.populate("leaderboard.artistId", "username displayName profileImage");
    await competition.populate("leaderboard.artworks", "title url aiScore");

    res.json({
      success: true,
      leaderboard: competition.leaderboard,
      week: competition.week,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    });
  }
});

// @route   GET /api/competition/my-rank
// @desc    Get current user's rank and stats
// @access  Private
router.get("/my-rank", authenticate, async (req, res) => {
  try {
    const currentWeek = getCurrentWeek();
    const competition = await Competition.findOne({ week: currentWeek });

    if (!competition) {
      return res.json({
        success: true,
        rank: null,
        totalScore: 0,
        averageScore: 0,
        artworkCount: 0,
        week: currentWeek,
      });
    }

    const myEntry = competition.leaderboard.find(
      (entry) => entry.artistId.toString() === req.artist._id.toString()
    );

    res.json({
      success: true,
      rank: myEntry?.rank || null,
      totalScore: myEntry?.totalScore || 0,
      averageScore: myEntry?.averageScore || 0,
      artworkCount: myEntry?.artworkCount || 0,
      week: competition.week,
      percentile: myEntry?.rank
        ? Math.round((1 - (myEntry.rank - 1) / competition.leaderboard.length) * 100)
        : 0,
    });
  } catch (error) {
    console.error("Get my rank error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rank",
    });
  }
});

// @route   POST /api/competition/recalculate
// @desc    Recalculate leaderboard for current week (admin/maintenance)
// @access  Private
router.post("/recalculate", authenticate, async (req, res) => {
  try {
    const currentWeek = getCurrentWeek();
    await updateLeaderboard(currentWeek);

    res.json({
      success: true,
      message: "Leaderboard recalculated successfully",
    });
  } catch (error) {
    console.error("Recalculate error:", error);
    res.status(500).json({
      success: false,
      message: "Error recalculating leaderboard",
    });
  }
});

/**
 * Update leaderboard for a given week
 * Exported for use in artRoutes
 */
const updateLeaderboard = async (week) => {
  // Get all artworks for this week
  const artworks = await Art.find({
    competitionWeek: week,
    isPublic: true,
  }).populate("artistId", "username displayName");

  // Group by artist and calculate totals
  const artistScores = {};
  artworks.forEach((artwork) => {
    const artistId = artwork.artistId._id.toString();
    if (!artistScores[artistId]) {
      artistScores[artistId] = {
        artistId: artwork.artistId._id,
        totalScore: 0,
        artworkCount: 0,
        artworks: [],
      };
    }
    const score = artwork.aiScore?.overall || 0;
    artistScores[artistId].totalScore += score;
    artistScores[artistId].artworkCount += 1;
    artistScores[artistId].artworks.push(artwork._id);
  });

  // Convert to array and calculate averages
  const leaderboard = Object.values(artistScores).map((entry) => ({
    ...entry,
    averageScore: entry.totalScore / entry.artworkCount,
  }));

  // Sort by total score (descending)
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Update or create competition
  const { startDate, endDate } = getWeekDates(week);
  await Competition.findOneAndUpdate(
    { week },
    {
      week,
      startDate,
      endDate,
      leaderboard,
      status: new Date() > endDate ? "completed" : "active",
    },
    { upsert: true, new: true }
  );

  // Update artwork ranks
  for (const entry of leaderboard) {
    await Art.updateMany(
      { _id: { $in: entry.artworks } },
      { $set: { rankThisWeek: entry.rank, totalScoreThisWeek: entry.totalScore } }
    );
  }
};

// Export updateLeaderboard function
export { updateLeaderboard };

export default router;

