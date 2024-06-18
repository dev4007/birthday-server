import mongoose from "mongoose";
import User from "../auth/authModel.js";

const customerSchema = new mongoose.Schema({});

export default User.discriminator("Customer", customerSchema);
