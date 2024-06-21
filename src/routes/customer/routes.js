import express from "express";
import {fileUpload} from './../../utils/fileUpload.js';
import { getAllCustomer ,ScheduleList,getCustomerNotifications,sendWish,getWishes} from "../../controllers/customer/customerController.js";

import { inviteFriend, sendBulkInvitations } from "../../controllers/common/invitation/inviteController.js";
import authMiddleware from './../../middleware/authMiddleware.js';

const router = express.Router();

//wishes
router.post("/create-wish",authMiddleware,fileUpload.single('uploadedPhoto') , sendWish);
router.get("/get-wish" , getWishes);
router.get("/get-customer" , getAllCustomer);
router.get("/schedule-list/:id", ScheduleList);
router.get("/notification-list", getCustomerNotifications);

//invite
router.post("/invite",authMiddleware, inviteFriend);
router.post("/bulk",authMiddleware, sendBulkInvitations);


export default router;
