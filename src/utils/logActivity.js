import ActivityLog from "../../models/activityLog";

export const logActivity = async (user, action, description) => {
  try {
    await ActivityLog.create({
      action,
      description,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};
