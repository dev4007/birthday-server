import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "./src/assets/voices";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const name = "audio";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/mp3") {
    req.fileValidationError = "File Type must be audio/mp3 or audio/mpeg";
    return cb(null, false, req.fileValidationError);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('voiceRecording', 5); // 'audios' is the field name for multiple files


export default upload;
