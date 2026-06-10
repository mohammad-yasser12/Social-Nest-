

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const FindFriends = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const currentUserId = useSelector((state) => state.auth.user?._id);

//   // ✅ Fetch users from posts
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3039/api/posts/all-posts",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // 🔥 Extract unique users from posts
//       const posts = res.data.data;

//       const uniqueUsersMap = new Map();

//       posts.forEach((post) => {
//         const user = post.user;

//         // ❌ skip current logged user
//         if (!user || user._id === currentUserId) return;

//         // ✅ avoid duplicates
//         if (!uniqueUsersMap.has(user._id)) {
//           uniqueUsersMap.set(user._id, {
//             ...user,
//             requested: false,
//           });
//         }
//       });

//       const uniqueUsers = Array.from(uniqueUsersMap.values());

//       setUsers(uniqueUsers);

//       console.log("Users:", uniqueUsers);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Send follow request
//   const handleFollowUser = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:3039/api/follow/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // 🔥 Update UI instantly
//       setUsers((prev) =>
//         prev.map((user) =>
//           user._id === id ? { ...user, requested: true } : user
//         )
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUnfollowUser = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:3039/api/unfollow/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // 🔥 Update UI instantly
//       setUsers((prev) =>
//         prev.map((user) =>
//           user._id === id ? { ...user, requested: false } : user
//         )
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   if (loading) return <p className="p-6">Loading users...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Find Friends</h1>

//       <div className="grid md:grid-cols-2 gap-4">
//         {users.map((user) => (
//           <div
//             key={user._id}
//             className="flex items-center justify-between p-4 bg-white shadow rounded-xl"
//           >
//             {/* 👤 USER INFO */}
//             <div className="flex items-center gap-3">
//               <img
//   src={
//     user.profilepicture
//       ? `http://localhost:3039${user.profilepicture}`
//       : "/default.png"
//   }
//   alt="profile"
//   className="w-10 h-10 rounded-full object-cover"
// />
//               <p className="font-medium">{user.username}</p>
//             </div>

//             {/* ➕ BUTTON */}
//             <button
//               onClick={() => handleFollowUser(user._id)}
//               disabled={user.requested}
//               className={`px-3 py-1 rounded-lg text-white ${
//                 user.requested
//                   ? "bg-gray-400"
//                   : "bg-blue-500 hover:bg-blue-600"
//               }`}
//             >
//               {user.requested ? "Following" : "Follow"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FindFriends;

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createOrGetConversation } from "../api/messageApi";

const FindFriends = () => {
    const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users
 const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:3039/api/auth/users", {
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
      await axios.post(
        `http://localhost:3039/api/auth/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 🔥 Update UI instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isFollowing: true } : user
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Unfollow user
  const handleUnfollowUser = async (id) => {
    try {
      await axios.post(
        `http://localhost:3039/api/auth/unfollow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 🔥 Update UI instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isFollowing: false } : user
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

const handleMessages = async (receiverId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await createOrGetConversation(receiverId, token);

    const conversationId = res.data.conversation._id;

    navigate(`/messages/${conversationId}`); // ✅ correct
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
      ? `http://localhost:3039${user.profilepicture}`
      : "/default.png"
  }
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
  onError={(e) => (e.target.src = "/default.png")}
/>
              <p className="font-medium">{user.username}</p>
             

            {/* 🔥 FOLLOW / UNFOLLOW BUTTON */}
            
           <button
  onClick={() =>
    user.followStatus === "accepted"
      ? handleUnfollowUser(user._id)
      : handleFollowUser(user._id)
  }
  className={`px-3 py-1 rounded-lg text-white ${
    user.followStatus === "accepted"
      ? "bg-gray-400 hover:bg-gray-500"
      : user.followStatus === "pending"
      ? "bg-yellow-500"
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
    <button onClick={() => handleMessages(user._id)}>
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