// models/sendWishModel.js

import mongoose from "mongoose";

const characters = [
  "Mickey Mouse",
  "SpongeBob SquarePants",
  "Scooby Doo",
  "Elsa (Frozen)",
  "Spider Man (animated series)",
  "Tom and Jerry",
  "Dora the Explorer",
  "Peppa Pig",
];

const sendWishSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  dateOfBirth: { type: Date, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  birthdayCallDate: { type: Date, required: true }, // Separate field for birthday call date
  birthdayCallTime: { type: String, required: true }, // Separate field for birthday call time
  favoriteCharacter: [{ type: String, enum: characters, required: true }],
  specialMessage: { type: String },
  uploadedPhoto: { type: String }, // Assuming you store the URL of the uploaded photo
});

const SendWish = mongoose.model("SendWish", sendWishSchema);

export default SendWish;
