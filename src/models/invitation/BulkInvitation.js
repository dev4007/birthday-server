// models/BulkInvitation.js

import mongoose from 'mongoose';

const bulkInvitationSchema = new mongoose.Schema({
  emailList: { type: [String], required: true }, // Array of email addresses for bulk email invitations
  // You can add more fields as needed for bulk invitations
});

const BulkInvitation = mongoose.model('BulkInvitation', bulkInvitationSchema);

export default BulkInvitation;
