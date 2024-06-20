import mongoose from "mongoose";
import User from "../auth/authModel.js";

const specialty = [
  "Cartoon Character Specialist",
  "Celebrity Voice Impersonator",
  "Warm and Friendly Narrator",
  "Multilingual Voice Artist",
];
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

const artistSchema = new mongoose.Schema({
  voiceRecording: [
    {
      display_name: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
  ],
  moreInformation: { type: String },
  specialtyForVoiceMessage: [{ type: String, enum: specialty, required: true }],
  charactersForVoiceOver: [{ type: String, enum: characters, required: true }],
   suspended: { type: Boolean, default: false }, // Defaults to false (not suspended)
});

export default User.discriminator("Artist", artistSchema);
