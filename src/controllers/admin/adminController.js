import Schedule from "../../models/admin/Schedule.js";
import Notification from "../../models/admin/Notification.js";

import Artist from "../../models/artist/Artist.js";
import Customer from "../../models/customer/Customer.js";
import User from "../../models/auth/authModel.js";
import cloudinaryUploader from "../../utils/cloudinaryUpload.js";
import upload from "../../utils/uploadAudio.js";
import multer from "multer";
import SendWish from "../../models/customer/SendWishes.js";

export const createSchedule = async (req, res) => {
  try {
    const {
      birthdayWishesName,
      voiceArtist, // This should be the ObjectId of the artist
      customer, // This should be the ObjectId of the customer
      dateAndTime,
      moreInformation,
    } = req.body;

    // Ensure voiceArtistName and customer are valid ObjectIds
    const artist = await Artist.findOne({ email: voiceArtist });
    // const customerDoc = await Customer.findOne({ email: customer });
    const wish = await SendWish.findOne({ email: birthdayWishesName });
    const customerDoc = await Customer.findOne(wish.wishCreatedBy);

    if (!artist) {
      return res.status(400).json({ message: "Invalid artist" });
    }

    if (!customerDoc) {
      return res.status(400).json({ message: "Invalid customer" });
    }

    const newSchedule = new Schedule({
      birthdayWishesName: wish,
      voiceArtist: artist,
      customer: customerDoc,
      dateAndTime,
      moreInformation,
    });

    await newSchedule.save();
    res
      .status(201)
      .json({ message: "Schedule created successfully", newSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await Schedule.findById(scheduleId)
      .populate(
        "birthdayWishesName",
        "firstName gender birthDate address city state phoneNumber email birthdayCallDate birthdayCallTime favoriteCharacter specialMessage uploadedPhoto"
      )
      .populate(
        "voiceArtist",
        "firstName gender birthDate address city state mobileNumber email moreInformation charactersForVoiceOver"
      )
      .populate(
        "customer",
        "firstName gender birthDate address city state mobileNumber email"
      );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Find the associated sendWish details for the customer
    const sendWishDetails = await SendWish.findOne({
      wishCreatedBy: schedule.customer._id,
    });

    // Add sendWishDetails to the schedule object
    if (sendWishDetails) {
      schedule.sendWishDetails = sendWishDetails;
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("birthdayWishesName", "firstName lastName email")
      .populate("voiceArtist", "firstName lastName email")
      .populate("customer", "firstName lastName email");
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, description, sendNotificationTo } = req.body;
    let file = req.file ? req.file.path : null; // Handle file upload, if any

    if (
      sendNotificationTo !== "customer" &&
      sendNotificationTo !== "artist" &&
      sendNotificationTo !== "all"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid sendNotificationTo value" });
    }
    const newNotification = new Notification({
      title,
      description,
      sendNotificationTo, // Indicate it's for a customer
      file,
    });
    await newNotification.save();

    res.status(201).json({
      message: "Notification created and sent successfully",
      data: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllNotification = async (req, res) => {
  try {
    const notice = await Notification.find();
    res.status(200).json(notice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getNotificationById = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOne({
      _id: notificationId,
    });

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

//artist and customer
export const toggleSuspension = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    let UserModel;
    // Determine the appropriate model based on user's role
    switch (user.role) {
      case "customer":
        UserModel = Customer;
        break;
      case "artist":
        UserModel = Artist;
        break;
      // Add cases for other roles if needed
      default:
        return res.status(400).json({ msg: "Invalid role" });
    }

    // Find the user in the specific model collection
    const specificUser = await UserModel.findById(id);
    if (!specificUser) {
      return res.status(404).json({ msg: "User details not found" });
    }
    // Toggle the suspension status
    specificUser.suspended = !specificUser.suspended;
    // Save the updated user
    await specificUser.save();
    res.json({
      msg: `User ${
        specificUser.suspended ? "suspended" : "Active"
      } successfully`,
      data: specificUser,
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({ msg: "Server error" });
  }
};

// updateUser (artist and customer)

export const updateUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ msg: "Multer error" });
    } else if (err) {
      return res.status(500).json({ msg: "Unknown error" });
    }
    const { id } = req.params;
    const { email, ...updateData } = req.body;

    try {
      // Fetch user details from the database
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (
        updateData.specialtyForVoiceMessage &&
        typeof updateData.specialtyForVoiceMessage === "string"
      ) {
        updateData.specialtyForVoiceMessage =
          updateData.specialtyForVoiceMessage
            .split(",")
            .map((specialty) => specialty.trim());
      }

      if (
        updateData.charactersForVoiceOver &&
        typeof updateData.charactersForVoiceOver === "string"
      ) {
        updateData.charactersForVoiceOver = updateData.charactersForVoiceOver
          .split(",")
          .map((specialty) => specialty.trim());
      }

      if (req.files && req.files.length > 0) {
        const audioResponse = await cloudinaryUploader(req, res);

        if (!audioResponse || audioResponse.length === 0) {
          return res.status(500).json({ msg: "Error uploading audio file" });
        }
        // Update voiceRecording field with new data
        updateData.voiceRecording = audioResponse.map((response) => ({
          display_name: response.display_name,
          secure_url: response.secure_url,
        }));
      }

      let updatedUser;

      switch (user.role) {
        case "artist":
          if (email) {
            updateData.email = email;
            const existingUser = await Artist.findOne({ email });
            if (existingUser && existingUser._id.toString() !== id) {
              return res.status(400).json({ msg: "Email already exists" });
            }
          }
          updatedUser = await Artist.findByIdAndUpdate(id, updateData, {
            new: true,
          }).select("-password"); // Exclude password from returned document;
          break;

        case "customer":
          if (email) {
            updateData.email = email;
            const existingUser = await Customer.findOne({ email });
            if (existingUser && existingUser._id.toString() !== id) {
              return res.status(400).json({ msg: "Email already exists" });
            }
          }
          updatedUser = await Customer.findByIdAndUpdate(id, updateData, {
            new: true,
          }).select("-password"); // Exclude password from returned document;
          break;

        default:
          return res.status(400).json({ msg: "Invalid role" });
      }

      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ msg: "User updated successfully", data: updatedUser });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ msg: "Server error" });
    }
  });
};

export const listCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Controller function to get a customer by ID
export const getCustomerById = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await User.findOne({
      _id: customerId,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const listArtists = async (req, res) => {
  try {
    const artists = await User.find({ role: "artist" }).select("-password");
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Controller function to get a customer by ID
export const getArtistById = async (req, res) => {
  const artistId = req.params.id;

  try {
    const artist = await User.findOne({
      _id: artistId,
      role: "artist",
    }).select("-password");

    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }

    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Customer and artist List
