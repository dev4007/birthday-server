import { v2 as cloudinaryLib } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinary = cloudinaryLib;

export { cloudinary };