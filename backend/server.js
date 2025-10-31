import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import artRoutes from "./routes/artRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// Robust CORS setup for dev and production
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://chitra-artist.vercel.app", // Add Vercel URL directly as fallback
  "https://chitra-artist.vercel.app/", // With trailing slash
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or curl (no origin)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin (exact or starts with)
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed || origin.startsWith(allowed.replace(/\/$/, ''));
      }
      return false;
    });
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    // Log blocked origin for debugging (remove in production if needed)
    console.log('CORS blocked origin:', origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎨 Aesthetic Art Club API is running!",
    version: "2.0.0",
      endpoints: {
      auth: "/api/auth",
      artists: "/api/artists",
      art: "/api/art",
      upload: "/api/upload",
      competition: "/api/competition",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/art", artRoutes);
app.use("/api/competition", competitionRoutes);

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private (authenticated artists only)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "aesthetic-artclub",
      transformation: [
        { width: 1500, height: 1500, crop: "limit" }, // Max dimensions
        { quality: "auto" }, // Auto quality optimization
        { fetch_format: "auto" }, // Auto format (WebP if supported)
      ],
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

// @route   DELETE /api/upload
// @desc    Delete image from Cloudinary
// @access  Private
app.delete("/api/upload", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: "Image deleted successfully from Cloudinary",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
});

// Serve static files from uploads folder (if needed for temp files)
app.use("/uploads", express.static(uploadsDir));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB",
      });
    }
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n✨ Ready to accept requests...\n`);
});