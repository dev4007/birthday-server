import multer from "multer";
import path from "path";

// Multer configuration for handling file uploads
export const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/assets/images"); // Adjust destination folder as needed
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Only JPEG and PNG files are allowed!"), false); // Reject file
    }
  },
});

// Define the allowed file types and their corresponding mimetypes
const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Multer configuration for handling file uploads
export const allFileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/assets/files"); // Adjust destination folder as needed
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(
        new Error("Only PDF, PNG, DOC, DOCX, XLS, XLSX files are allowed!"),
        false
      ); // Reject file
    }
  },
});
