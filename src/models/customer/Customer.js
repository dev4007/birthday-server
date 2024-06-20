import mongoose from "mongoose";
import User from "../auth/authModel.js";

const customerSchema = new mongoose.Schema({
  suspended: { type: Boolean, default: false }, // Defaults to false (not suspended)
});

export default User.discriminator("Customer", customerSchema);
