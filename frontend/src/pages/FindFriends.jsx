

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createOrGetConversation } from "../api/MessageApi";
import Api from "../api/Api";
const FindFriends = () => {
    const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // ✅ Fetch all users
 const fetchUsers = async () => {
  try {
    const res = await Api.get("/auth/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const myId = JSON.parse(localStorage.getItem("user"))?._id;

    const updatedUsers = res.data.data.map((u) => ({
      ...u,
      isFollowing: u.followers?.some(
        (id) => id.toString() === myId
      ),
    }));

    setUsers(updatedUsers);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // ✅ Follow user
  const handleFollowUser = async (id) => {
  try {
    await Api.post(
      `/auth/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id
          ? { ...user, followStatus: "pending" }
          : user
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  // ✅ Unfollow user
const handleUnfollowUser = async (id) => {
  try {
    await Api.post(
      `/auth/unfollow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id
          ? { ...user, followStatus: null }
          : user
      )
    );
  } catch (err) {
    console.log(err);
  }
};

const handleCancelRequest = async (id) => {
  try {
    await Api.post(
      `/auth/cancel-follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id
          ? { ...user, followStatus: null }
          : user
      )
    );
  } catch (err) {
    console.log(err);
  }
};

const handleMessages = async (receiverId, username, profilepicture) => {
  try {
    const res = await createOrGetConversation(receiverId);

    const conversationId =
      res?.data?.conversation?._id || res?.data?._id;

    if (!conversationId) {
      console.log("Conversation ID not found", res.data);
      return;
    }

    navigate(`/messages/${conversationId}`, {
      state: {
        receiverId,
        username,
        profilepicture,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Find Friends</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 bg-white shadow rounded-xl"
          >
            {/* 👤 USER INFO */}
            <div className="flex items-center gap-3">
            <img
  src={
    user?.profilepicture
      ? `https://social-nest-1-flyx.onrender.com${user.profilepicture}`
      : "/default.png"
  }
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
  onError={(e) => (e.target.src = "/default.png")}
/>
              <p className="font-medium">{user.username}</p>
             

            {/* 🔥 FOLLOW / UNFOLLOW BUTTON */}
            
 <button
  onClick={() => {
    if (user.followStatus === "accepted") {
      handleUnfollowUser(user._id);
    } else if (user.followStatus === "pending") {
      handleCancelRequest(user._id);
    } else {
      handleFollowUser(user._id);
    }
  }}
  className={`px-3 py-1 rounded-lg text-white ${
    user.followStatus === "accepted"
      ? "bg-gray-400 hover:bg-gray-500"
      : user.followStatus === "pending"
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-blue-500 hover:bg-blue-600"
  }`}
>
  {user.followStatus === "accepted"
    ? "Following"
    : user.followStatus === "pending"
    ? "Requested"
    : "Follow"}
</button>
         {user.followStatus === "accepted" && (
   <button
  onClick={() =>
    handleMessages(
      user._id,
      user.username,
      user.profilepicture
    )
  }
>
  <FaEnvelope />
</button>
  )}
      
              
            </div>
          </div>
          
        ))}
      </div>

     
    </div>
  );
};

export default FindFriends;