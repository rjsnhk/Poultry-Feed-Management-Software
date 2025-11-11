const Admin = require("../models/Admin.js");
const Message = require("../models/Message.js");
const { client } = require("../config/redis.js");

const getAllMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.params;

    // const chatKey = `chat:${userId}:${adminId}`;

    // 1. Check Redis Cache
    // let cachedMessages = await client.zRange(chatKey, 0, -1);

    // if (cachedMessages.length > 0) {
    //   const parsed = cachedMessages.map(JSON.parse);

    //   return res.status(200).json({
    //     data: parsed,
    //     success: true,
    //     message: "Messages fetched from Redis",
    //   });
    // }

    // 2. Fetch from MongoDB (cache miss)
    const messages = await Message.find({
      $or: [
        { senderId: adminId, receiverId: userId },
        { senderId: userId, receiverId: adminId },
      ],
    }).sort({ timestamp: 1 });

    // 3. Store messages in Redis ZSET
    // for (const msg of messages) {
    //   await client.zAdd(chatKey, [
    //     {
    //       score: new Date(msg.timestamp).getTime(),
    //       value: JSON.stringify(msg),
    //     },
    //   ]);
    // }

    // Optional: set expiry (to avoid infinite storage)
    // await client.expire(chatKey, 60 * 60); // 1 hour TTL

    return res.status(200).json({
      data: messages,
      success: true,
      message: "Messages fetched from MongoDB",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: err.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { adminId, employeeId, currentUserId } = req.params;

    // Wo user jisne page open kiya hai
    const readerId = currentUserId;

    const messageFrom = readerId === adminId ? employeeId : adminId;

    const messageTo = readerId;

    const result = await Message.updateMany(
      {
        senderId: messageFrom,
        receiverId: messageTo,
        read: false,
      },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Messages marked as read",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: err.message,
    });
  }
};

const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res
    .status(200)
    .json({ data: admins, message: "Fetched all admins", success: true });
};

module.exports = { getAllMessages, getAllAdmins, markAsRead };
