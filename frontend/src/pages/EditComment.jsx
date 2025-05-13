import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditComment = () => {
    const navigate = useNavigate();
    const { postId, commentId } = useParams();  // Get postId and commentId from the URL
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const currentUserId = useSelector(state => state.auth.user?._id);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3039/api/comments/${commentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (res.data.comment.user._id !== currentUserId) {
                    // Ensure that the user can only edit their own comment
                    navigate('/');
                    return;
                }
                setCommentText(res.data.comment.text);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching comment:', err);
                navigate('/');
            }
        };

        fetchComment();
    }, [commentId, currentUserId, navigate]);

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleUpdateComment = async () => {
        if (!commentText.trim()) {
            // Prevent empty comment submission
            return;
        }

        try {
            const res = await axios.put(
                `http://localhost:3039/api/comments/update/${commentId}`,
                { text: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            // Successfully updated the comment, navigate back to the post page
            navigate(`/post/${postId}`);
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const handleCancel = () => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Edit Comment</h2>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    value={commentText}
                    onChange={handleCommentChange}
                    rows="4"
                    placeholder="Edit your comment..."
                />
                <div className="flex gap-4">
                    <button
                        onClick={handleUpdateComment}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditComment;
