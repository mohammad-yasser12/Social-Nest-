
import { useState, useEffect } from "react";
import axios from "axios";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Api from "../api/api";
const CommentComponent = ({ postId }) => {
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
const [showComments, setShowComments] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [comments, setComments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch comments when toggled
useEffect(() => {
  if (!showComments) return;

  const fetchComments = async () => {
    try {
      const res = await Api.get(
        `/posts/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  fetchComments();
}, [postId, showComments]);

  const handleDeleteComment = async (commentId) => {
    try {
      await Api.delete(
        `/posts/delete/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleCommentSubmit = async () => {
    const text = commentTexts[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await Api.post(
        `/posts/comment/${postId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setComments((prev) => [...prev, res.data]);
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      setShowInput(false);
      setShowComments(true);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleEditCommentRedirect = (postId, comment) => {
    navigate(`/posts/update/${comment._id}`, {
      state: {
        postId,
        comment,
      },
    });
  };

  const handleToggleComments = () => {
  setShowComments((prev) => {
    const newState = !prev;

    // show input only when comments open
    setShowInput(newState);

    return newState;
  });
};

  return (
    <div>
      <button
        onClick={handleToggleComments}
        className="text-sm text-purple-600 mt-2"
      >
        💬 Comment
      </button>

      {showInput && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentTexts[postId] || ""}
            onChange={(e) =>
              setCommentTexts((prev) => ({
                ...prev,
                [postId]: e.target.value,
              }))
            }
            className="border rounded px-2 py-1 w-full"
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-1 text-sm bg-purple-600 text-white px-3 py-1 rounded"
          >
            Send
          </button>
        </div>
      )}

      {showComments && (
        <div className="mt-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="relative border p-3 rounded-md bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                 <img
  src={
    comment.user?.profilepicture?.startsWith("http")
      ? comment.user.profilepicture
      : comment.user?.profilepicture
      ? `https://social-nest-1-flyx.onrender.com${comment.user.profilepicture}`
      : "https://via.placeholder.com/40"
  }
  alt="Profile"
  className="w-8 h-8 rounded-full object-cover border"
/>
                  <div>
                    <p className="font-semibold text-sm">
                      {comment.user?.username || "Unknown"}
                    </p>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === comment._id ? null : comment._id
                      )
                    }
                    className="p-1 hover:bg-gray-200 rounded-full"
                    aria-label="More options"
                  >
                    <FiMoreVertical size={18} />
                  </button>

                  {openMenuId === comment._id && (
                    <div className="absolute right-0 top-8 w-36 bg-white border rounded-lg shadow-md z-50">
                      <button
                        onClick={() =>
                          handleEditCommentRedirect(postId, comment)
                        }
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => {
                          handleDeleteComment(comment._id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
