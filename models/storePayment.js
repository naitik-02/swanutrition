import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  bankName: String,
  ifsc: String,
  iban: String,
  bicSwift: String,
}, { _id: false });

const paymentSettingsSchema = new mongoose.Schema({
  cod: {
    enabled: { type: Boolean, default: false },
    title: String,
    description: String,
    instructions: String,
  },
  check: {
    enabled: { type: Boolean, default: false },
    title: String,
    description: String,
    instructions: String,
  },
  bankTransfer: {
    enabled: { type: Boolean, default: false },
    title: String,
    description: String,
    instructions: String,
    accountDetails: [bankAccountSchema], 
  },
}, { timestamps: true });

export default mongoose.models.PaymentSettings ||
  mongoose.model("PaymentSettings", paymentSettingsSchema);
