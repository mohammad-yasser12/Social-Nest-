import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const EditComment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { postId, comment } = state || {};
    const [text, setText] = useState(comment?.text || '');

       

    const handleUpdate = async () => {
        try {
            const res = await axios.put(
                `http://localhost:3039/api/posts/update/${comment._id}`,
                { text },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            const id = postId; 
            navigate(`/post/${id}`); // Redirect after update
             state: { updated: true }
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const id = postId; 
  const handleCancel = () => {
   navigate(`/post/${id}`); // clear comment input
  };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-4">Edit Comment</h2>
            <textarea
                className="w-full max-w-lg p-2 border rounded mb-4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
            />
            <div className='flex flex-col gap-4'>
                 <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdate}
            >
                Update Comment
            </button>
            <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            type="button" onClick={handleCancel}>Cancel</button>

            </div>
           
        </div>
    );
};

export default EditComment;
