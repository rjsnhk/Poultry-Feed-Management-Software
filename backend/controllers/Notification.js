const Notification = require("../models/Notification");
const Subscription = require("../models/Subscription");
const sendPushNotification = require("../sendPushNotification");

// ✅ Save subscription
const saveSubscription = async (req, res) => {
  const { employeeId, role, subscription, browserId } = req.body;

  const subs = await Subscription.findOneAndUpdate(
    { employeeId, browserId },
    { role, subscription, browserId },
    { upsert: true }
  );

  res.json({ success: true });
};

const removeSubscription = async (req, res) => {
  const { endpoint } = req.body;

  await Subscription.deleteOne({ "subscription.endpoint": endpoint });

  return res.json({
    message: "Subscription removed successfully",
    success: true,
  });
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ receiverId: userId });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

const markRead = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.updateMany(
      { receiverId: userId },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "Notifications marked as read successfully",
      data: notifications,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to mark notifications as read",
      error: err.message,
    });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.deleteMany({ receiverId: userId });

    res.status(200).json({
      success: true,
      message: "Notifications cleared successfully",
      data: notifications,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to clear notifications",
      error: err.message,
    });
  }
};

const sendPush = async (req, res) => {
  try {
    const { receiverId, message, role } = req.body;
    sendPushNotification(role, { message, receiverId });
    res.json({
      success: true,
      message: "Push notification sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Failed to send push notification",
      error: err.message,
    });
  }
};

module.exports = {
  getNotifications,
  clearNotifications,
  saveSubscription,
  removeSubscription,
  markRead,
  sendPush,
};
