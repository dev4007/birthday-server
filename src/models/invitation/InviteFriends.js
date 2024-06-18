// models/InviteFriends.js

import mongoose from 'mongoose';

const inviteFriendsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String }
});

const InviteFriends = mongoose.model('InviteFriends', inviteFriendsSchema);

export default InviteFriends;
