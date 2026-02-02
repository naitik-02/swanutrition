

import mongoose from "mongoose";

const accountPrivacySchema = new mongoose.Schema({
  guestCheckout: { type: Boolean, default: true },
  enableLoginDuringCheckout: { type: Boolean, default: false },

  allowAccountCreation: {
    duringCheckout: { type: Boolean, default: false },
    onMyAccountPage: { type: Boolean, default: false },
  },
  sendPasswordLink: { type: Boolean, default: true },

  accountErasureRequests: {
    removePersonalData: { type: Boolean, default: false },
    removeDownloadAccess: { type: Boolean, default: false },
    allowBulkRemoval: { type: Boolean, default: false },
  },

  registrationPrivacyPolicy: { type: String, default: "" },
  checkoutPrivacyPolicy: { type: String, default: "" },
});

export default mongoose.models.AccountPrivacySettings ||
  mongoose.model("AccountPrivacySettings", accountPrivacySchema);
