import axios from "axios";
import API from "../api/api";
// const API = "https://social-nest-1-flyx.onrender.com/api";

// ✅ Create or get conversation
// export const createOrGetConversation = async (receiverId, token) => {
//   return axios.post(
//     `${API}/message/converzations`,
//     { receiverId },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };
 
export const createOrGetConversation = async (receiverId, token) => {
  return API.post(
    "/message/conversations",
    { receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✅ Send message
export const sendMessage = (conversationId, text, token) => {
  return API.post(
    "/message/send",
    { conversationId, text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✅ Get messages
export const getMessages = (conversationId, token) => {
  return API.get(`/message/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const getConversations = async (token) => {
//   return axios.get(`${API}/message/conversation`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const getConversations = () => {
  return API.get("/message/conversation", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deleteForMe = (messageId, token) => {
  return axios.put(
    `http://localhost:3039/api/message/delete/me/${messageId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteForEveryone = (messageId, token) => {
  return axios.put(
    `http://localhost:3039/api/message/delete/everyone/${messageId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};