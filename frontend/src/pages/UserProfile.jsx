

// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { Pencil, Trash2, MoreVertical, Heart } from 'lucide-react';
// import { FaRegCommentDots } from 'react-icons/fa';

// const UserProfile = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [totalLikes, setTotalLikes] = useState(0);
//     const [totalPosts, setTotalPosts] = useState(0);
//     const [actionDropdownId, setActionDropdownId] = useState(null);
//     const [sortType, setSortType] = useState('');
//     const [showSortDropdown, setShowSortDropdown] = useState(false);
//     const [likedPosts, setLikedPosts] = useState([]); // Array of post IDs that the current user has liked
//     const [commentInputs, setCommentInputs] = useState({});
//     const [postComments, setPostComments] = useState({});






//     const profileDropdownRef = useRef(null);
//     const postDropdownRefs = useRef({});

//     const currentUserId = useSelector((state) => state.auth.user?._id);




//     const isOwner = currentUserId === user?._id;

//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         const fetchUserAndPosts = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:3039/api/auth/count/${id}`);
//                 setUser(res.data.user);
//                 setPosts(res.data.posts);
//                 setTotalLikes(res.data.totalLikes);
//                 setTotalPosts(res.data.totalPosts);
//             } catch (err) {
//                 console.error('Error fetching user profile:', err);
//             }
//         };
//         fetchUserAndPosts();
//     }, [id]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 profileDropdownRef.current &&
//                 !profileDropdownRef.current.contains(event.target) &&
//                 actionDropdownId === 'profile'
//             ) {
//                 setActionDropdownId(null);
//             }

//             const isInsidePostDropdown = Object.values(postDropdownRefs.current).some(
//                 (ref) => ref && ref.contains(event.target)
//             );

//             if (!isInsidePostDropdown && actionDropdownId !== 'profile') {
//                 setActionDropdownId(null);
//             }

//             setShowSortDropdown(false);
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [actionDropdownId]);

//     const handleDeleteProfilePicture = async () => {
//         try {
//             await axios.delete(`http://localhost:3039/api/auth/delete-profile-picture/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const res = await axios.get(`http://localhost:3039/api/auth/count/${id}`);
//             setUser(res.data.user);
//             setTotalLikes(res.data.totalLikes);
//             setTotalPosts(res.data.totalPosts);
//         } catch (err) {
//             console.error('Failed to delete profile picture', err);
//         }
//     };

//     const handleDeletePost = async (postId) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this post?');
//         if (!confirmDelete) return;

//         try {
//             await axios.delete(`http://localhost:3039/api/posts/delete-post/${postId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPosts((prev) => prev.filter((post) => post._id !== postId));
//             setTotalPosts((prev) => prev - 1);
//         } catch (err) {
//             console.error('Error deleting post:', err);
//         }
//     };

//     const handleEditPost = (postId) => {
//         navigate(`/edit-post/${postId}`);
//     };

//     const handleSort = async (type) => {
//         try {
//             const res = await axios.get(`http://localhost:3039/api/posts/user/${id}?sort=${type}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPosts([...res.data.data]);
//             setSortType(type);
//             setShowSortDropdown(false);
//         } catch (err) {
//             console.error("Error sorting posts:", err);
//         }
//     };

//     const handleLikeToggle = (postId) => {
//         if (likedPosts.includes(postId)) {
//             // If already liked, remove it from likedPosts
//             setLikedPosts(likedPosts.filter(id => id !== postId));
//         } else {
//             // If not liked, add it to likedPosts
//             setLikedPosts([...likedPosts, postId]);
//         }
//     };

//     const handleCommentInputChange = (postId, newComment) => {
//         setCommentInputs((prev) => ({
//             ...prev,
//             [postId]: newComment, // Update the input for the specific post ID
//         }));
//     };


//     const handleCommentSubmit = async (postId) => {
//         const comment = commentInputs[postId];

//         if (!comment) return; // Don't submit empty comments

//         try {
//             // Assuming you have an API endpoint to post a comment
//             const response = await axios.post(`/api/posts/${postId}/comments`, { comment });

//             // Update postComments to reflect the new comment
//             setPostComments((prev) => ({
//                 ...prev,
//                 [postId]: [...(prev[postId] || []), response.data.newComment],
//             }));

//             // Clear the input field after submitting
//             setCommentInputs((prev) => ({
//                 ...prev,
//                 [postId]: '',
//             }));
//         } catch (error) {
//             console.error('Failed to submit comment:', error);
//         }
//         <FaRegCommentDots />
//     };







//     if (!user) return <div className="text-center mt-10">Loading user profile...</div>;

//     return (
//         <div className="max-w-2xl mx-auto p-4 mt-10 bg-white shadow rounded">
//             <div className="flex justify-between mb-4">
//                 <button
//                     onClick={() => navigate('/')}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
//                 >
//                     Back
//                 </button>
//                 <div className="relative">
//                     <button
//                         onClick={() => setShowSortDropdown(!showSortDropdown)}
//                         className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
//                     >
//                         Post Insights
//                     </button>
//                     {showSortDropdown && (
//                         <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded z-10">
//                             <button
//                                 onMouseDown={() => handleSort('likes')}
//                                 className="block px-4 py-2 w-full text-left hover:bg-gray-100"
//                             >
//                                 Most Liked
//                             </button>
//                             <button
//                                 onMouseDown={() => handleSort('comments')}
//                                 className="block px-4 py-2 w-full text-left hover:bg-gray-100"
//                             >
//                                 Most Commented
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <div className="flex flex-col items-center mb-6 relative">
//                 <img
//                     src={user.profilepicture ? `http://localhost:3039${user.profilepicture}` : '/default-profile.jpg'}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover border mb-2"
//                 />
//                 {isOwner && (
//                     <div className="absolute top-2 right-2" ref={profileDropdownRef}>
//                         <button
//                             onClick={() =>
//                                 setActionDropdownId((prev) => (prev === 'profile' ? null : 'profile'))
//                             }
//                             className="p-1 rounded-full hover:bg-gray-200"
//                         >
//                             <MoreVertical className="w-5 h-5 text-gray-700" />
//                         </button>
//                         {actionDropdownId === 'profile' && (
//                             <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
//                                 <button
//                                     onClick={() => navigate(`/edit-profile-picture/${user._id}`)}
//                                     className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
//                                 >
//                                     Change Profile Picture
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         handleDeleteProfilePicture();
//                                         setActionDropdownId(null);
//                                     }}
//                                     className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
//                                 >
//                                     Delete Profile Picture
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//                 <div className="text-xl font-bold text-gray-800">{user.username}</div>
//                 <div className="text-gray-600 mt-1">
//                     <span className="mr-4">Total Posts: <strong>{totalPosts}</strong></span>
//                     <span>Total Likes: <strong>{totalLikes}</strong></span>
//                 </div>
//             </div>

//             <div className="space-y-6">
//                 {posts.length === 0 ? (
//                     <p className="text-gray-500 text-center">No posts from this user</p>
//                 ) : (
//                     posts.map((post) => {
//                         const hasLiked = post.likes?.includes(currentUserId);
//                         const comments = post.comments || [];
//                         const isLiked = likedPosts.includes(post._id);
//                         const commentsForPost = postComments[post._id] || [];


//                         return (
//                             <div key={post._id} className="bg-gray-50 border p-4 rounded shadow relative">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <h3 className="font-semibold text-purple-700">{post.caption}</h3>
//                                     {isOwner && (
//                                         <div
//                                             className="relative"
//                                             ref={(el) => (postDropdownRefs.current[post._id] = el)}
//                                         >
//                                             <button
//                                                 onClick={() =>
//                                                     setActionDropdownId((prev) =>
//                                                         prev === post._id ? null : post._id
//                                                     )
//                                                 }
//                                                 className="text-gray-700 hover:text-black p-1 rounded-full hover:bg-gray-200"
//                                             >
//                                                 <MoreVertical className="w-5 h-5" />
//                                             </button>
//                                             {actionDropdownId === post._id && (
//                                                 <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
//                                                     <button
//                                                         onClick={() => handleEditPost(post._id)}
//                                                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                                                     >
//                                                         Edit
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDeletePost(post._id)}
//                                                         className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>

//                                 {post.image && (
//                                     <img
//                                         src={`http://localhost:3039${post.image}`}
//                                         alt="Post"
//                                         className="w-full h-64 object-cover rounded mb-2"
//                                     />
//                                 )}
//                                 <p className="text-gray-600 mb-2">{post.content}</p>

//                                 <div key={post._id} className="post-container">
//                                     {/* Like button */}
//                                     <button
//                                         onClick={() => handleLikeToggle(post._id)}
//                                         className={`text-xl ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
//                                     >
//                                         {isLiked ? '💙' : '🤍'} Like
//                                     </button>

//                                     {/* Comments section */}
//                                     <div className="comments-section">
//                                         <h4>Comments:</h4>
//                                         {commentsForPost.length > 0 ? (
//                                             commentsForPost.map((comment, index) => (
//                                                 <div key={index} className="comment">
//                                                     <p>{comment.text}</p>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p>No comments yet!</p>
//                                         )}

//                                         {/* Comment input */}
//                                         <input
//                                             type="text"
//                                             placeholder="Write a comment..."
//                                             value={commentInputs[post._id] || ''}
//                                             onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
//                                         />

//                                         {/* Submit with icon */}
//                                         <button onClick={() => handleCommentSubmit(post._id)} className="text-gray-500 text-xl ml-2">
//                                             💬
//                                         </button>
//                                     </div>
//                                 </div>





//                             </div>
//                         );
//                     })
//                 )}
//             </div>



//         </div>
//     );
// };

// export default UserProfile;




import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, MoreVertical, Heart } from 'lucide-react';
import { FaRegCommentDots } from 'react-icons/fa';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [actionDropdownId, setActionDropdownId] = useState(null);
    const [sortType, setSortType] = useState('');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [likedPosts, setLikedPosts] = useState([]); // Array of post IDs that the current user has liked
    const [commentInputs, setCommentInputs] = useState({});
    const [postComments, setPostComments] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});







    const profileDropdownRef = useRef(null);
    const postDropdownRefs = useRef({});

    const currentUserId = useSelector((state) => state.auth.user?._id);




    const isOwner = currentUserId === user?._id;

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:3039/api/auth/count/${id}`);
                setUser(res.data.user);
                setPosts(res.data.posts);
                setTotalLikes(res.data.totalLikes);
                setTotalPosts(res.data.totalPosts);
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };
        fetchUserAndPosts();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target) &&
                actionDropdownId === 'profile'
            ) {
                setActionDropdownId(null);
            }

            const isInsidePostDropdown = Object.values(postDropdownRefs.current).some(
                (ref) => ref && ref.contains(event.target)
            );

            if (!isInsidePostDropdown && actionDropdownId !== 'profile') {
                setActionDropdownId(null);
            }

            setShowSortDropdown(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [actionDropdownId]);

    const handleDeleteProfilePicture = async () => {
        try {
            await axios.delete(`http://localhost:3039/api/auth/delete-profile-picture/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await axios.get(`http://localhost:3039/api/auth/count/${id}`);
            setUser(res.data.user);
            setTotalLikes(res.data.totalLikes);
            setTotalPosts(res.data.totalPosts);
        } catch (err) {
            console.error('Failed to delete profile picture', err);
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3039/api/posts/delete-post/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts((prev) => prev.filter((post) => post._id !== postId));
            setTotalPosts((prev) => prev - 1);
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleEditPost = (postId) => {
        navigate(`/edit-post/${postId}`);
    };

    const handleSort = async (type) => {
        try {
            const res = await axios.get(`http://localhost:3039/api/posts/user/${id}?sort=${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts([...res.data.data]);
            setSortType(type);
            setShowSortDropdown(false);
        } catch (err) {
            console.error("Error sorting posts:", err);
        }
    };

    // const handleLikeToggle = (postId) => {
    //     setLikedPosts((prevLikedPosts) => {
    //       if (prevLikedPosts.includes(postId)) {
    //         // Unlike the post
    //         return prevLikedPosts.filter((id) => id !== postId);
    //       } else {
    //         // Like the post
    //         return [...prevLikedPosts, postId];
    //       }
    //     });
    //   };

      const handleCommentInputChange = (postId, value) => {
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: value,
        }));
      };

      const handleCommentSubmit = async (postId) => {
        const text = commentInputs[postId];
        if (!text) return;

        try {
            const res = await axios.post(
                `http://localhost:3039/api/posts/comment/${postId}`,
                { text },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setPosts(prev =>
                prev.map(p =>
                    p._id === postId
                        ? { ...p, comments: [...(p.comments || []), res.data] }
                        : p
                )
            );
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    const handleLike = async (postId) => {
        try {
            const post = posts.find(p => p._id === postId);
            const isLiked = post.likes?.includes(currentUserId);
            const updatedLikes = isLiked
                ? post.likes.filter(id => id !== currentUserId)
                : [...post.likes, currentUserId];

            await axios.put(
                `http://localhost:3039/api/posts/like/${postId}`,
                { likes: updatedLikes },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setPosts(prev =>
                prev.map(p =>
                    p._id === postId ? { ...p, likes: updatedLikes } : p
                )
            );
        } catch (err) {
            console.error('Like error:', err);
        }
    };

      
      



    if (!user) return <div className="text-center mt-10">Loading user profile...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 mt-10 bg-white shadow rounded">
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                    Back
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Post Insights
                    </button>
                    {showSortDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded z-10">
                            <button
                                onMouseDown={() => handleSort('likes')}
                                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                            >
                                Most Liked
                            </button>
                            <button
                                onMouseDown={() => handleSort('comments')}
                                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                            >
                                Most Commented
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center mb-6 relative">
                <img
                    src={user.profilepicture ? `http://localhost:3039${user.profilepicture}` : '/default-profile.jpg'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border mb-2"
                />
                {isOwner && (
                    <div className="absolute top-2 right-2" ref={profileDropdownRef}>
                        <button
                            onClick={() =>
                                setActionDropdownId((prev) => (prev === 'profile' ? null : 'profile'))
                            }
                            className="p-1 rounded-full hover:bg-gray-200"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-700" />
                        </button>
                        {actionDropdownId === 'profile' && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                                <button
                                    onClick={() => navigate(`/edit-profile-picture/${user._id}`)}
                                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                                >
                                    Change Profile Picture
                                </button>
                                <button
                                    onClick={() => {
                                        handleDeleteProfilePicture();
                                        setActionDropdownId(null);
                                    }}
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                    Delete Profile Picture
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className="text-xl font-bold text-gray-800">{user.username}</div>
                <div className="text-gray-600 mt-1">
                    <span className="mr-4">Total Posts: <strong>{totalPosts}</strong></span>
                    <span>Total Likes: <strong>{totalLikes}</strong></span>
                </div>
            </div>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <p className="text-gray-500 text-center">No posts from this user</p>
                ) : (
                    posts.map((post) => {
                        const hasLiked = post.likes?.includes(currentUserId);
                        const comments = post.comments || [];
                        const isLiked = post.likes?.includes(currentUserId);
                        const commentsForPost = postComments[post._id] || [];


                        return (
                            <div key={post._id} className="bg-gray-50 border p-4 rounded shadow relative">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-purple-700">{post.caption}</h3>
                                    {isOwner && (
                                        <div
                                            className="relative"
                                            ref={(el) => (postDropdownRefs.current[post._id] = el)}
                                        >
                                            <button
                                                onClick={() =>
                                                    setActionDropdownId((prev) =>
                                                        prev === post._id ? null : post._id
                                                    )
                                                }
                                                className="text-gray-700 hover:text-black p-1 rounded-full hover:bg-gray-200"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                            {actionDropdownId === post._id && (
                                                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                                                    <button
                                                        onClick={() => handleEditPost(post._id)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {post.image && (
                                    <img
                                        src={`http://localhost:3039${post.image}`}
                                        alt="Post"
                                        className="w-full h-64 object-cover rounded mb-2"
                                    />
                                )}
                                <p className="text-gray-600 mb-2">{post.content}</p>
           {/* ////////////////////////////////////////////////////////////////////////////////////////// */}

                                <div key={post._id} className=" flex flex-row justify-start align-middle post-container gap-6">
                                    {/* Like button */}
                                    <div className='mt-4'>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`text-xl ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                                    >
                                        {isLiked ? '💙' : '🤍'} Like
                                    </button>

                                    </div>
                                    

                                    {/* Comments section */}
                                    <div className="comments-section mt-2 mb-16">

                                        {commentsForPost.length > 0 ? (
                                            commentsForPost.map((comment, index) => (
                                                <div key={index} className="comment">
                                                    <p>{comment.text}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p></p>
                                        )}

                                        {/* Toggle comment input */}
                                        <button
                                            onClick={() =>
                                                setShowCommentInput((prev) => ({
                                                    ...prev,
                                                    [post._id]: !prev[post._id],
                                                }))
                                            }
                                            className="text-gray-500 text-lg mt-2"
                                        >
                                            💬 Comment
                                        </button>

                                        {/* Conditionally show input */}
                                        {showCommentInput[post._id] && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentInputs[post._id] || ''}
                                                    onChange={(e) =>
                                                        handleCommentInputChange(post._id, e.target.value)
                                                    }
                                                    className="border rounded px-2 py-1"
                                                />
                                                <button
                                                    onClick={() => handleCommentSubmit(post._id)}
                                                    className="text-blue-500  text-lg ml-2 rounded-xl border-4 "
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
          {/* ///////////////////////* //////////////////////////////////////////////////////////////////////////////// */} 



                            </div>
                        );
                    })
                )}
            </div>



        </div>
    );
};

export default UserProfile;

