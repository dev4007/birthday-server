import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  birthdayWishesName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SendWish',
    required: true
  },
  voiceArtist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  }, 
   dateAndTime: { type: Date, required: true },
  moreInformation: { type: String }
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
