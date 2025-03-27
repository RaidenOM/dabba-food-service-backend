const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dabba-food-service",
  },
});

module.exports = {
  cloudinary,
  storage,
};
