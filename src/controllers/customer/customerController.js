import Schedule from "../../models/admin/Schedule.js";
import Customer from "../../models/customer/Customer.js";
import Notification from "../../models/admin/Notification.js";
import SendWish from "../../models/customer/SendWishes.js";
import User from "../../models/auth/authModel.js";


export const getAllCustomer = async (req, res) => {
    try {
      const customer = await Customer.find();
      res.status(200).json({ length: customer.length , data: customer}); 
    } catch (err) {
      console.error(`Error fetching customer: ${err.message}`);
      res.status(500).send("Server error");
    }
  };



  
export const ScheduleList = async (req, res) => {
  try {
    const customer = req.params;
    const schedules = await Schedule.find({ customer: customer.id })
      .populate("voiceArtist", "firstName lastName") // Optionally populate customer details
      .sort({ dateAndTime: "asc" }); // Sort schedules by date/time

     const formattedSchedules = schedules.map(schedule => ({
      birthdayWishesName: schedule.birthdayWishesName,
      voiceArtist: `${schedule.voiceArtist.firstName} ${schedule.voiceArtist.lastName}`,
      dateAndTime: schedule.dateAndTime,
      moreInformation: schedule.moreInformation,
    }));

    res.status(200).json({ length: formattedSchedules.length, data: formattedSchedules });
  } catch (error) {
    console.error(`Error fetching Art: ${err.message}`);
    res.status(500).send("Server error");
  }
};
  

export const getCustomerNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ sendNotificationTo: { $in: ['customer', 'all'] } })
    .select('title description file createdAt -_id') // Select specific fields and exclude _id
    .exec();

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const sendWish = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    birthDate,
    state,
    address,
    phoneNumber,
    email,
    birthdayCallDate, // Separate field for birthday call date
    birthdayCallTime, // Separate field for birthday call time
    favoriteCharacter,
    specialMessage,
  } = req.body;

  const uploadedPhoto = req.file ? req.file.path : null; // Assuming multer uploads the file and provides its path

  const customerId = req.user.id; // Assuming the role is stored in req.user.role

  const findCustomer = await Customer.findById(customerId);
  // console.log("🚀 ~ sendWish ~ findCustomer:", findCustomer)
  if (!findCustomer) {
    return res
      .status(403)
      .json({ message: "Invalid Customer" });
  }


  try {
    const newWish = new SendWish({
      firstName,
      lastName,
      gender,
      birthDate,
      state,
      address,
      phoneNumber,
      email,
      birthdayCallDate, // Assign birthday call date field
      birthdayCallTime, // Assign birthday call time field
      favoriteCharacter,
      specialMessage,
      uploadedPhoto,
      wishCreatedBy : findCustomer.id

    });

    await newWish.save();
    res.status(201).json({ message: "Wish sent successfully", data: newWish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWishes = async (req, res) => {
  try {
    const wishes = await SendWish.find();
    res.status(200).json({ length: wishes.length , data: wishes}); 

  } catch (err) {
    console.error(`Error fetching wishes: ${err.message}`);
    res.status(500).send("Server error");
  }
};
