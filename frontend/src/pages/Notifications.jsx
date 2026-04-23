import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3039/api/auth/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:3039/api/auth/notifications/read/${id}`,
        {},
        {
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