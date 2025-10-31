import jwt from "jsonwebtoken";
import Artist from "../models/Artist.js";

// Protect routes - verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided, authorization denied" 
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get artist from database (without password)
    const artist = await Artist.findById(decoded.id).select("-password");

    if (!artist) {
      return res.status(401).json({ 
        success: false, 
        message: "Artist not found" 
      });
    }

    if (!artist.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is deactivated" 
      });
    }

    // Attach artist to request object
    req.artist = artist;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Server error in authentication" 
    });
  }
};

// Verify ownership of resource
export const verifyOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          message: "Resource not found" 
        });
      }

      // Check if artist owns this resource
      if (resource.artistId.toString() !== req.artist._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: "You don't have permission to modify this resource" 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Error verifying ownership" 
      });
    }
  };
};