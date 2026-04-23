import { Link, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Notifications from "../pages/Notifications";
import { createOrGetConversation } from "../api/messageApi";
import { 
  FaHome, 
  FaPlus, 
  FaUser, 
  FaUserFriends, 
  FaUserClock, 
  FaBell, 
  FaSignOutAlt 
} from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();

const dispatch = useDispatch();
    const token = localStorage.getItem("token");
  
const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
    const id = user?._id;

    // 🔔 NEW STATE
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
        const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                "http://localhost:3039/api/auth/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };


   const handleLogout = () => {
    localStorage.removeItem("token");

    // clear redux user (IMPORTANT)
    dispatch({ type: "auth/logout" });

    navigate("/signup", { replace: true });
};

useEffect(() => {
    fetchNotifications();
}, []);
    if (!isAuthenticated) return null;

    const handleCreatePost = () => navigate('/createpost');
    const handleHome = () => navigate("/");
    const handleProfile = () => navigate(`/user/${id}`);
    const handleFindFriends = () => navigate(`/user_list/${id}`);
    const handleFollowRequests = () => navigate(`/follow-requests`);
const handleMessages = () => {
  navigate("/messages"); // just go to inbox
};
    // 🔥 FETCH NOTIFICATIONS

   

    // 🔢 UNREAD COUNT
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="bg-blue-600 p-4 flex justify-between items-center h-32 text-white">
            <div className="text-lg font-semibold">
                <h2 className="text-3xl font-extrabold text-white">SocialNest</h2>
            </div>

        <div className="space-x-4 flex items-center text-xl">
  
  <button onClick={handleHome} className="btn">
    <FaHome />
  </button>

  <button onClick={handleCreatePost} className="btn">
    <FaPlus />
  </button>

  <button onClick={handleProfile} className="btn">
    <FaUser />
  </button>

  <button onClick={handleFindFriends} className="btn">
    <FaUserFriends />
  </button>

  <button onClick={handleFollowRequests} className="btn">
    <FaUserClock />
  </button>

  {/* 🔔 NOTIFICATION */}
  <div className="relative">
    <button
      onClick={() => setShowNotifications(!showNotifications)}
      className="text-2xl"
    >
      <FaBell />
    </button>

    {/* 🔢 BADGE */}
    {unreadCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {unreadCount}
      </span>
    )}

    {/* 📩 DROPDOWN */}
    {showNotifications && (
      <div className="absolute right-0 mt-2 z-50 text-black">
        <Notifications
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </div>
    )}
  </div>
<button onClick={handleMessages} className="btn text-xl">
  <FaEnvelope />
</button>
  <button 
    onClick={handleLogout} 
    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
  >
    <FaSignOutAlt />
  </button>

</div>
        </nav>
    );
}

export default Navbar;