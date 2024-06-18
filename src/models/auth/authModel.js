import mongoose from "mongoose";

const validGenders = ["Male", "Female"];
const validRoles = ["admin", "artist", "customer"];

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: validRoles, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: validGenders, required: true },
    birthDate: { type: Date, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
