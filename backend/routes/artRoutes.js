import express from "express";
import Art from "../models/Art.js";
import { authenticate, verifyOwnership } from "../middleware/authMiddleware.js";
import { scoreArtwork, getCurrentWeek } from "../services/aiScoringService.js";
import { updateLeaderboard } from "./competitionRoutes.js";

const router = express.Router();

// @route   GET /api/art/my-artworks
// @desc    Get logged-in artist's artworks
// @access  Private
router.get("/my-artworks", authenticate, async (req, res) => {
  try {
    const artworks = await Art.find({ artistId: req.artist._id })
      .sort({ createdAt: -1 });

    const MAX_ARTWORKS_PER_ARTIST = parseInt(process.env.MAX_ARTWORKS_PER_ARTIST) || 100;
    const currentCount = artworks.length;
    const remainingSlots = Math.max(0, MAX_ARTWORKS_PER_ARTIST - currentCount);

    res.json({
      success: true,
      count: artworks.length,
      artworks,
      limit: MAX_ARTWORKS_PER_ARTIST,
      remaining: remainingSlots,
      canUploadMore: remainingSlots > 0,
    });
  } catch (error) {
    console.error("Get my artworks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artworks",
    });
  }
});

// @route   POST /api/art
// @desc    Create new artwork
// @access  Private
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      publicId,
      category,
      tags,
      isPrintAvailable,
      isPublic,
    } = req.body;

    // Validation
    if (!title || !url || !publicId) {
      return res.status(400).json({
        success: false,
        message: "Title, URL, and publicId are required",
      });
    }

    // Check artwork limit per artist (configurable via env or default 100)
    const MAX_ARTWORKS_PER_ARTIST = parseInt(process.env.MAX_ARTWORKS_PER_ARTIST) || 100;
    const currentArtCount = await Art.countDocuments({ artistId: req.artist._id });
    
    if (currentArtCount >= MAX_ARTWORKS_PER_ARTIST) {
      return res.status(403).json({
        success: false,
        message: `You have reached the maximum limit of ${MAX_ARTWORKS_PER_ARTIST} artworks. Please delete some artworks before uploading new ones.`,
        limit: MAX_ARTWORKS_PER_ARTIST,
        current: currentArtCount,
      });
    }

    // AI Score the artwork (async, don't block response)
    const currentWeek = getCurrentWeek();
    let aiScoreResult = {
      overall: 0,
      aesthetic: 0,
      technical: 0,
      creativity: 0,
      composition: 0,
    };

    try {
      aiScoreResult = await scoreArtwork({
        title,
        description,
        category,
        tags,
        url,
      });
    } catch (error) {
      console.error("AI scoring error:", error);
      // Continue even if scoring fails
    }

    // Create artwork with AI score
    const artwork = await Art.create({
      artistId: req.artist._id,
      title,
      description: description || "",
      url,
      publicId,
      category: category || "other",
      tags: tags || [],
      isPrintAvailable: isPrintAvailable || false,
      isPublic: isPublic !== undefined ? isPublic : true,
      aiScore: {
        ...aiScoreResult,
        scoredAt: new Date(),
      },
      competitionWeek: currentWeek,
    });

    // Update leaderboard asynchronously (don't wait)
    updateLeaderboard(currentWeek).catch((err) => {
      console.error("Leaderboard update error:", err);
    });

    res.status(201).json({
      success: true,
      message: "Artwork created successfully",
      artwork: {
        ...artwork.toObject(),
        aiScore: artwork.aiScore,
      },
    });
  } catch (error) {
    console.error("Create artwork error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating artwork",
      error: error.message,
    });
  }
});

// @route   GET /api/art/:id
// @desc    Get single artwork
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Art.findById(req.params.id)
      .populate("artistId", "username displayName profileImage");

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    // If artwork is private, only owner can view
    if (!artwork.isPublic) {
      // Check if requester is the owner
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({
          success: false,
          message: "This artwork is private",
        });
      }
      // Add authentication check here if needed
    }

    res.json({
      success: true,
      artwork,
    });
  } catch (error) {
    console.error("Get artwork error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artwork",
    });
  }
});

// @route   PUT /api/art/:id
// @desc    Update artwork
// @access  Private (owner only)
router.put("/:id", authenticate, verifyOwnership(Art), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      isPrintAvailable,
      isPublic,
    } = req.body;

    const artwork = req.resource; // From verifyOwnership middleware

    if (title) artwork.title = title;
    if (description !== undefined) artwork.description = description;
    if (category) artwork.category = category;
    if (tags) artwork.tags = tags;
    if (isPrintAvailable !== undefined) artwork.isPrintAvailable = isPrintAvailable;
    if (isPublic !== undefined) artwork.isPublic = isPublic;

    await artwork.save();

    res.json({
      success: true,
      message: "Artwork updated successfully",
      artwork,
    });
  } catch (error) {
    console.error("Update artwork error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating artwork",
    });
  }
});

// @route   DELETE /api/art/:id
// @desc    Delete artwork
// @access  Private (owner only)
router.delete("/:id", authenticate, verifyOwnership(Art), async (req, res) => {
  try {
    await Art.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Artwork deleted successfully",
    });
  } catch (error) {
    console.error("Delete artwork error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting artwork",
    });
  }
});

// @route   GET /api/art
// @desc    Get all public artworks (with pagination and filters)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = { isPublic: true };

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const artworks = await Art.find(query)
      .populate("artistId", "username displayName profileImage")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Art.countDocuments(query);

    res.json({
      success: true,
      artworks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Get artworks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artworks",
    });
  }
});

export default router;