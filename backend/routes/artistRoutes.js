import express from "express";
import Artist from "../models/Artist.js";
import Art from "../models/Art.js";

const router = express.Router();

// @route   GET /api/artists
// @desc    Get all artists (for landing page)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find({ isActive: true })
      .select("-password -email")
      .sort({ createdAt: -1 })
      .limit(50);

    // Get artwork count for each artist
    const artistsWithCount = await Promise.all(
      artists.map(async (artist) => {
        const artCount = await Art.countDocuments({
          artistId: artist._id,
          isPublic: true,
        });
        return {
          ...artist.toObject(),
          artworkCount: artCount,
        };
      })
    );

    res.json({
      success: true,
      count: artistsWithCount.length,
      artists: artistsWithCount,
    });
  } catch (error) {
    console.error("Get artists error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artists",
    });
  }
});

// @route   GET /api/artists/:username
// @desc    Get single artist profile and their artworks
// @access  Public
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find artist by username
    const artist = await Artist.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    }).select("-password -email");

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Get artist's public artworks
    const artworks = await Art.find({
      artistId: artist._id,
      isPublic: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      artist: artist.getPublicProfile(),
      artworks,
    });
  } catch (error) {
    console.error("Get artist profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artist profile",
    });
  }
});

// @route   GET /api/artists/:username/stats
// @desc    Get artist statistics
// @access  Public
router.get("/:username/stats", async (req, res) => {
  try {
    const { username } = req.params;

    const artist = await Artist.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    const totalArtworks = await Art.countDocuments({
      artistId: artist._id,
      isPublic: true,
    });

    const artworksByCategory = await Art.aggregate([
      { 
        $match: { 
          artistId: artist._id,
          isPublic: true 
        } 
      },
      { 
        $group: { 
          _id: "$category", 
          count: { $sum: 1 } 
        } 
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalArtworks,
        artworksByCategory,
        memberSince: artist.createdAt,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
});

export default router;