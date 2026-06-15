import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Api from '../api/Api';
const LikeComponent = ({ post }) => {
    const [likes, setLikes] = useState(post.likes || []);
    const [likedUsers, setLikedUsers] = useState([]);
    const [openLikes, setOpenLikes] = useState(false);
    const currentUserId = useSelector(state => state.auth.user?._id);
    const isLiked = likes.includes(currentUserId);

    useEffect(() => {
        setLikes(post.likes || []);
    }, [post.likes]);

    const handleLike = async () => {
        try {
            const updatedLikes = isLiked
                ? likes.filter(id => id !== currentUserId)
                : [...likes, currentUserId];

            await Api.put(
                `/posts/like/${post._id}`,
                { likes: updatedLikes },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setLikes(updatedLikes);
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const toggleLikesList = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await Api.get(
                `/posts/likes/${post._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setLikedUsers(res.data.users);
            setOpenLikes(!openLikes);
        } catch (err) {
            console.error('Error fetching liked users:', err);
        }
    };

    return (
        <div className="flex flex-row gap-4 items-center">
           
               
            <div className='flex flex-col '>

                 <div className='flex flex-row gap-4'>
                     <button
                onClick={handleLike}
                className={`text-xl ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
            >
                {isLiked ? '💙' : '🤍'} Like
            </button>
                
            <h3
                className="text-base text-gray-600 mt-1 cursor-pointer"
                onClick={toggleLikesList}
            >
                {likes.length} likes
            </h3>


            </div>

               
            {openLikes && (
                <div className="mt-2 bg-gray-100 p-2 rounded-md">
                    {likedUsers.length > 0 ? (
                        likedUsers.map(user => (
                            <div key={user._id} className="flex items-center gap-2 mb-2">
                                <img
                                    src={`https://social-nest-1-flyx.onrender.com${user.profilepicture}`}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full object-cover border"
                                />
                                <span className="text-gray-700 font-medium">{user.username}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No likes yet</p>
                    )}
                </div>
            )}


            </div>
           

        
         
   
        </div>
    );
};

export default LikeComponent;

