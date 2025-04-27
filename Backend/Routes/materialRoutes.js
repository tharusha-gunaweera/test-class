const express = require('express');
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const Material = require("../Model/Material.js");

const router = express.Router();

// Multer storage (memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|png|jpg|jpeg|mp4|avi|mov|mkv|flv/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, Word documents, images, and video files are allowed"));
    }
  },
});

// ✅ Upload material with file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description, uploadedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title || !uploadedBy) {
      return res.status(400).json({ message: "Title and uploadedBy are required" });
    }

    const newMaterial = new Material({
      title,
      description,
      uploadedBy,
      fileId: new mongoose.Types.ObjectId(), // Generate unique fileId
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      },
    });

    await newMaterial.save();

    res.status(201).json({
      message: "File uploaded successfully",
      material: newMaterial,
    });
  } catch (err) {
    console.error("Error uploading material:", err);
    if (err.message.includes("Only PDF")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Error uploading material", error: err.message });
  }
});

// ✅ Get all materials (without file data for optimization)
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().select("-file.data"); // Exclude file data
    res.status(200).json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving materials", error: err });
  }
});

// ✅ Get material by ID
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).select(
      "-file.data"
    );
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving material", error: err });
  }
});

// ✅ Download file by fileId
router.get("/download/:fileId", async (req, res) => {
  try {
    const material = await Material.findById(req.params.fileId); // Use _id for better accuracy

    if (!material) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", material.file.contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${material.file.fileName}"`
    );
    res.send(material.file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error downloading file", error: err });
  }
});

// ✅ Update material details
router.put("/:id", async (req, res) => {
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        uploadedBy: req.body.uploadedBy,
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    res
      .status(200)
      .json({ message: "Material updated successfully", updatedMaterial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating material", error: err });
  }
});

// ✅ Delete material by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMaterial = await Material.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    res
      .status(200)
      .json({ message: "Material deleted successfully", deletedMaterial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting material", error: err });
  }
});

// Fetch materials with filters for title, description, or teacher
router.get("/materials", async (req, res) => {
  try {
    const { search } = req.query; // Get search query from the request
    let filter = {};

    if (search) {
      // Use a case-insensitive regex to match title, description, or uploadedBy (teacher)
      const regex = new RegExp(search, "i");

      filter = {
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { uploadedBy: { $regex: regex } }, // Teacher field
        ],
      };
    }

    // Fetch materials based on the filter
    const materials = await Material.find(filter);
    res.json(materials);
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ message: "Error fetching materials" });
  }
});

module.exports = router;
