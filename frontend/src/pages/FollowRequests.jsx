import { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api/api";
const FollowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await Api.get(
        "/auth/follow-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequests(res.data.data);
      console.log("ansee",res.data.data);
      
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept
  const handleAccept = async (id) => {
    try {
      await Api.post(
        `/auth/accept-request/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequests((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    try {
      await Api.post(
        `/auth/reject-request/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequests((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Follow Requests</h1>

      {requests.length === 0 ? (
        <p>No follow requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-xl"
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.sender?.profilepicture
                      ? `https://social-nest-1-flyx.onrender.com${user.sender.profilepicture}`
                      : "/default.png"
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="font-medium">{user.sender.username}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(user._id)}
                  className="bg-green-500 text-white px-4 py-1 rounded-lg"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(user._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowRequests;