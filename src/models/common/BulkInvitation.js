// models/BulkInvitation.js

import mongoose from 'mongoose';

const bulkInvitationSchema = new mongoose.Schema({
  emailList: { type: [String], required: true }, // Array of email addresses for bulk email invitations
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for who invited this friend
    required: true,
  },
  role: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields as needed for bulk invitations
});

const BulkInvitation = mongoose.model('BulkInvitation', bulkInvitationSchema);

export default BulkInvitation;
