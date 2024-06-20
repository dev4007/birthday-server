import express from "express";
import { getAllArtist ,ScheduleList,getArtistNotifications,createStatus} from "../../controllers/artist/artistController.js";
import { inviteFriend, sendBulkInvitations } from "../../controllers/common/invitation/inviteController.js";
import authMiddleware from './../../middleware/authMiddleware.js';


const router = express.Router();

//artist
router.get("/get", getAllArtist);
router.get("/schedule-list/:id", ScheduleList);
router.get("/notification-list", getArtistNotifications);

//invite
router.post("/invite",authMiddleware, inviteFriend);
router.post("/bulk",authMiddleware, sendBulkInvitations)


//status
router.post("/status", createStatus);



export default router;
