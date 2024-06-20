// models/InviteFriends.js

import mongoose from "mongoose";

const inviteFriendsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for who invited this friend
    required: true,
  },
  role: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InviteFriends = mongoose.model("InviteFriends", inviteFriendsSchema);

export default InviteFriends;
