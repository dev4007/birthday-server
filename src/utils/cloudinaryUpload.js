// cloudinaryUpload.js

import { cloudinary } from './Cloudinary.js';

const cloudinaryUploader = async (req, res) => {
  const files = req.files; // 'files' will be an array containing information about each uploaded file

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Files Not Found' });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const fName = file.originalname.split('.')[0];
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: 'raw',
        public_id: `audioFile/${fName}-${Date.now()}`, // Example: audioFile/fileName-1624000000000
      });
       // Return an object with both display_name and secure_url
       return {
        display_name: uploadResult.original_filename,
        secure_url: uploadResult.secure_url,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    // console.log('Uploaded files:', uploadResults);
    return uploadResults;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ message: 'Error uploading to Cloudinary' });
  }
};

export default cloudinaryUploader;
