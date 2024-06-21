import User from "../../../models/auth/authModel.js";
import BulkInvitation from "../../../models/common/BulkInvitation.js";
import InviteFriends from "../../../models/common/InviteFriends.js";


export const inviteFriend = async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    // Assuming you have authenticated the user and have access to their role
    const userRole = req.user.id; // Assuming the role is stored in req.user.role

    const findRole = await User.findById(userRole);

    // Check if the user role is 'customer' or 'artist'
    if (findRole.role !== "admin" && findRole.role !== "customer" && findRole.role !== "artist") {
      return res
        .status(403)
        .json({ message: "Unauthorized to invite friends" });
    }

    // Check if email already exists
    const existingUser = await InviteFriends.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "already invited" });
    }

    const newInvite = new InviteFriends({
      role: findRole.role,
      firstName,
      lastName,
      email,
      phoneNumber,
      invitedBy: findRole.id, // Log who invited the friend
    });

    await newInvite.save();
    res.status(201).json({
      message: "Friend invited successfully",
      invite: {
        _id: newInvite._id,
        firstName: newInvite.firstName,
        lastName: newInvite.lastName,
        email: newInvite.email,
        phoneNumber: newInvite.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error inviting friend:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const sendBulkInvitations = async (req, res) => {
  const { emailList } = req.body;
  try {
    // Check user role and log the user who performed the action
    const userRole = req.user.id; // Assuming the role is stored in req.user.role

    const findRole = await User.findById(userRole);
    if (findRole.role !== "admin" ,findRole.role !== "customer" && findRole.role !== "artist") {
      return res
        .status(403)
        .json({ message: "Unauthorized to invite friends" });
    }

    const newBulkInvitation = new BulkInvitation({
      role: findRole.role,
      emailList,
      sentBy: findRole.id, // Log who sent the bulk invitations
    });

    await newBulkInvitation.save();

    // Prepare response with only necessary fields
    const response = {
      message: "Bulk invitations sent successfully",
      bulkInvitation: {
        _id: newBulkInvitation._id,
        emailList: newBulkInvitation.emailList,
        createdAt: newBulkInvitation.createdAt,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error sending bulk invitations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
