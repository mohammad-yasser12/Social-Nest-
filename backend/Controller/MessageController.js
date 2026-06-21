import Conversation from "../Model/Conversation.js";
import Message from "../Model/Message.js";
export const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.user_id;

    const participants = [senderId, receiverId]
      .map(id => id.toString())
      .sort();

    const uniqueKey = participants.join("_");

    let conversation = await Conversation.findOne({ uniqueKey });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        uniqueKey,
      });
    }

    res.status(200).json({ success: true, conversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.user.user_id;

    const message = await Message.create({
      conversationId,
      sender,
      text,
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("sender", "username profilepicture")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username profilepicture")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.user_id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // avoid duplicates
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    res.json({ message: "Deleted for you", messageId });
  } catch (err) {
    console.log(err);
  }
};

export const deleteForEveryone = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.user_id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🔥 Only sender allowed
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.text = "This message was deleted";
    message.isDeleted = true;

    await message.save();

    res.json({ message: "Deleted for everyone", updated: message });
  } catch (err) {
    console.log(err);
  }
};