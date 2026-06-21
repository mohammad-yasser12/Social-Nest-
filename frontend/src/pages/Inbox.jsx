import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConversations } from "../api/MessageApi";
import Api from "../api/api";
const Inbox = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);

  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await getConversations(token);
      console.log(res.data); // 🔥 DEBUG
      setConversations(res.data.conversations);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-5 border h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b">Friends Chat List</h2>

      {conversations.length === 0 && (
        <p className="text-center mt-5 text-gray-500">
          No conversations yet
        </p>
      )}

      {conversations.map((conv) => {
        console.log("Conversation ID:", conv._id);

      const otherUsers = conv.participants?.filter(
  (p) => p._id !== user._id
);
        return (
          <div
            key={conv._id}
           onClick={() =>
  navigate(`/messages/${conv._id}`, {
    state: {
      receiverId: otherUser?._id,
      username: otherUser?.username,
      profilepicture: otherUser?.profilepicture,
    },
  })
}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
          >
       <img
  src={
    otherUser?.profilepicture?.startsWith("http")
      ? otherUser.profilepicture
      : otherUser?.profilepicture
        ? `https://social-nest-1-flyx.onrender.com${otherUser.profilepicture}`
        : "https://via.placeholder.com/40"
  }
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
/>

            <div>
              <p className="font-semibold">
                {otherUser?.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                Open chat
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Inbox;