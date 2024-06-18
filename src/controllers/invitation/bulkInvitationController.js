// controllers/bulkInvitationController.js

import BulkInvitation from '../../models/invitation/BulkInvitation.js';

const sendBulkInvitations = async (req, res) => {
  const { emailList } = req.body;

  try {
    const newBulkInvitation = new BulkInvitation({
      emailList
    });

    await newBulkInvitation.save();
    res.status(201).json({ message: 'Bulk invitations sent successfully', bulkInvitation: newBulkInvitation });
  } catch (error) {
    console.error('Error sending bulk invitations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { sendBulkInvitations };
