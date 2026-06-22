import { useEffect, useState,useRef } from "react";
import axios from "axios";
import Api from "../api/api";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
    const res = await Api.get("/auth/notifications", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
   

      setNotifications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await Api.put(`/auth/notifications/read/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false); // 👈 close
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    
    <div className="w-80 bg-white shadow-lg rounded-xl p-3">
      <h2 className="font-bold mb-3">Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleMarkAsRead(n._id)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              n.isRead ? "bg-gray-100" : "bg-blue-100"
            }`}
          >
            {n.message}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;