import mongoose from 'mongoose';

const mediaSettingSchema = new mongoose.Schema({
  thumbnail: {
    width: { type: Number, required: true, default: 150 },
    height: { type: Number, required: true, default: 150 },
    crop: { type: Boolean, default: true },
  },
  medium: {
    maxWidth: { type: Number, required: true, default: 300 },
    maxHeight: { type: Number, required: true, default: 300 },
  },
  large: {
    maxWidth: { type: Number, required: true, default: 1024 },
    maxHeight: { type: Number, required: true, default: 1024 },
  },
  organizeUploads: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.MediaSetting || mongoose.model('MediaSetting', mediaSettingSchema);
