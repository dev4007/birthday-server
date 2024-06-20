import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sendNotificationTo: { type: String, enum: ['artist', 'customer', 'all'], required: true },
  file: { type: String } // File path or reference
}, { timestamps: true });


const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
