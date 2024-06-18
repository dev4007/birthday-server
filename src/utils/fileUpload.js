import multer from 'multer';
import path from 'path';

// Multer configuration for handling file uploads
const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/assets/images'); // Adjust destination folder as needed
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false); // Reject file
    }
  },
});

export default fileUpload;
