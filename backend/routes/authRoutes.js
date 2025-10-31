import express from "express";
import jwt from "jsonwebtoken";
import Artist from "../models/Artist.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/signup
// @desc    Register new artist
// @access  Public
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Validation
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check username format
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-30 characters, lowercase letters, numbers, and underscores only",
      });
    }

    // Check if artist exists
    const existingArtist = await Artist.findOne({
      $or: [{ email }, { username }],
    });

    if (existingArtist) {
      if (existingArtist.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
      if (existingArtist.username === username) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Create artist
    const artist = await Artist.create({
      username,
      email,
      password,
      displayName,
    });

    // Generate token
    const token = generateToken(artist._id);

    res.status(201).json({
      success: true,
      message: "Artist registered successfully",
      token,
      artist: artist.getPublicProfile(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating artist account",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login artist
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find artist
    const artist = await Artist.findOne({ email });

    if (!artist) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!artist.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await artist.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(artist._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      artist: artist.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in artist
// @access  Private
router.get("/me", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      artist: req.artist.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update artist profile
// @access  Private
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { displayName, bio, profileImage, socialLinks } = req.body;

    const artist = await Artist.findById(req.artist._id);

    if (displayName) artist.displayName = displayName;
    if (bio !== undefined) artist.bio = bio;
    if (profileImage) artist.profileImage = profileImage;
    if (socialLinks) {
      artist.socialLinks = {
        ...artist.socialLinks,
        ...socialLinks,
      };
    }

    await artist.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      artist: artist.getPublicProfile(),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
});

export default router;