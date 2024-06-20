import express from "express";
import {
  Register,
  Login,
  RefreshToken,
  RequestPasswordReset,
  ResetPassword,
} from "../../controllers/auth/authController.js";


const router = express.Router();

//auth customer
router.post("/register", Register);
router.post("/login", Login);
router.post("/refresh-token", RefreshToken);
router.post("/forget-password", RequestPasswordReset);
router.post("/reset-password", ResetPassword);

export default router;
