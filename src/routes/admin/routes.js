import express from "express";
import { createSchedule,getAllSchedules,createNotification,getAllNotification,updateUser,toggleSuspension } from "../../controllers/admin/adminController.js";
import { allFileUpload } from "../../utils/fileUpload.js";


const router = express.Router();

//admin
router.post("/create-schedule", createSchedule);
router.get("/get-schedule", getAllSchedules);
router.post("/create-notification", allFileUpload.single('file'),createNotification);
router.get("/get-notification",getAllNotification);

router.get("/get", getAllSchedules);
router.put("/edit/:id", updateUser);
router.put("/suspend/:id", toggleSuspension);  // suspend both artist & customer


export default router;
