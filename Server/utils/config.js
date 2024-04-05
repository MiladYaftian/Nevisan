require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || "ml_default";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = {
  cloudinary,
  UPLOAD_PRESET,
};
