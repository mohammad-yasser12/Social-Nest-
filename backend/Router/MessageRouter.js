import express from "express";
import { sendMessage, getMessages,createOrGetConversation,getUserConversations ,deleteForEveryone,deleteForMe} from "../Controller/MessageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.post("/send", authMiddleware, sendMessage);
messageRouter.post("/conversations", authMiddleware, createOrGetConversation);
messageRouter.get("/conversation", authMiddleware, getUserConversations);
messageRouter.get("/:conversationId", authMiddleware, getMessages);
messageRouter.put("/delete/me/:messageId", authMiddleware, deleteForMe);
messageRouter.put("/delete/everyone/:messageId", authMiddleware, deleteForEveryone);

export default messageRouter;