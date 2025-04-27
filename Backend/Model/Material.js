const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileId: { type: String, required: true },
  file: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Material", materialSchema);
