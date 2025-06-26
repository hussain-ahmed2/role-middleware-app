import multer from "multer";
import path from "path";

// Configure storage settings for multer
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Define the naming convention for uploaded files
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `avatar-${Date.now()}${ext}`); // Generate unique filename
  },
});

// Initialize multer with specified storage and options
const upload = multer({
  storage, // Use the configured storage settings
  limits: { fileSize: 2 * 1024 * 1024 }, // Set file size limit to 2 MB
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"]; // Allowed MIME types
    if (validTypes.includes(file.mimetype))
      cb(null, true); // Accept file if valid
    else cb(new Error("Only image files are allowed")); // Reject file if invalid
  },
});

export default upload;
