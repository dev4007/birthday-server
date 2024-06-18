import express from "express";
import {
    sendWish,getWishes
} from "../../controllers/customer/sendWishController.js";
import fileUpload from './../../utils/fileUpload.js';

const router = express.Router();

//wishes
router.post("/create-wish",fileUpload.single('uploadedPhoto') , sendWish);
router.get("/get-wish" , getWishes);


export default router;
