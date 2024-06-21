import express from "express";
import {
  createSchedule,
  getScheduleById,
  getAllSchedules,
  createNotification,
  getAllNotification,
  updateUser,
  toggleSuspension,
  listCustomers,
  getCustomerById,
  listArtists,
  getArtistById,
  getNotificationById,
} from "../../controllers/admin/adminController.js";
import { allFileUpload } from "../../utils/fileUpload.js";
import {
  inviteFriend,
  sendBulkInvitations,
} from "../../controllers/common/invitation/inviteController.js";
import authMiddleware from "./../../middleware/authMiddleware.js";

const router = express.Router();

//admin
router.post("/create-schedule", createSchedule);
router.get("/schedule/:id", getScheduleById);
router.get("/get-schedule", getAllSchedules);

router.post(
  "/create-notification",
  allFileUpload.single("file"),
  createNotification
);
router.get("/list-notifications", getAllNotification);
router.get("/notification/:id", getNotificationById);


router.get("/get", getAllSchedules);
router.put("/edit/:id", updateUser);
router.put("/suspend/:id", toggleSuspension); // suspend both artist & customer
router.get("/list-customers", listCustomers); 
router.get("/customers/:id", getCustomerById); 

router.get("/list-artists", listArtists); 
router.get("/artists/:id", getArtistById); 


// get Customer

//invite
router.post("/invite", authMiddleware, inviteFriend);
router.post("/bulk", authMiddleware, sendBulkInvitations);

export default router;
