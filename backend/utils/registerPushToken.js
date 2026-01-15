import User from "../models/User";

export const registerPushToken = async (req, res) => {
  const { token } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    expoPushToken: token,
  });

  res.json({ success: true });
};
