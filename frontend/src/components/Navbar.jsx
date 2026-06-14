import { Link, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import Notifications from "../pages/Notifications";
import { createOrGetConversation } from "../api/MessageApi";
import Api from "../api/Api";
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
const notificationRef = useRef(null);
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
            const res = await Api.get(
                "https://social-nest-1-flyx.onrender.com/api/auth/notifications",
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

    useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);


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
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 px-8 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">

      {/* Logo */}
      <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        SocialNest
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-4">

        <button
          onClick={handleHome}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaHome size={22} />
        </button>

        <button
          onClick={handleCreatePost}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaPlus size={22} />
        </button>

        <button
          onClick={handleProfile}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaUser size={22} />
        </button>

        <button
          onClick={handleFindFriends}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaUserFriends size={22} />
        </button>

        <button
          onClick={handleFollowRequests}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaUserClock size={22} />
        </button>

        {/* Notifications */}
       <div className="relative" ref={notificationRef}>
  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
  >
    <FaBell size={22} />
  </button>

  {unreadCount > 0 && (
    <span className="absolute top-1 right-1 h-5 min-w-[20px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
      {unreadCount}
    </span>
  )}

  {showNotifications && (
    <div className="absolute right-0 mt-3 z-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  )}
</div>

        {/* Messages */}
        <button
          onClick={handleMessages}
          className="p-3 rounded-2xl hover:bg-blue-50 transition-all duration-200"
        >
          <FaEnvelope size={22} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
        >
          <FaSignOutAlt />
        </button>

      </div>
    </div>
  </nav>
);
}

export default Navbar;