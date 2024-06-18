import mongoose from "mongoose";
import User from "../auth/authModel.js";

const adminSchema = new mongoose.Schema({});

export default User.discriminator("Admin", adminSchema);
