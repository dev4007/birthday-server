// controllers/inviteFriendsController.js

import InviteFriends from '../../models/invitation/InviteFriends.js';

const inviteFriend = async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    const newInvite = new InviteFriends({
      firstName,
      lastName,
      email,
      phoneNumber
    });

    await newInvite.save();
    res.status(201).json({ message: 'Friend invited successfully', invite: newInvite });
  } catch (error) {
    console.error('Error inviting friend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { inviteFriend };
