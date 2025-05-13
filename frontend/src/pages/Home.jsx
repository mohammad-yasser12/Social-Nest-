// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const Home = () => {
//     const navigate = useNavigate();
//     const [posts, setPosts] = useState([]);
//     const [openComments, setOpenComments] = useState({});
//     const [commentTexts, setCommentTexts] = useState({});
//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const [editedCommentTexts, setEditedCommentTexts] = useState({});
//     const [commentMenuOpen, setCommentMenuOpen] = useState({}); // dropdown toggle

//     const currentUserId = useSelector(state => state.auth.user?._id);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const res = await axios.get('http://localhost:3039/api/posts/all-posts');
//                 setPosts(res.data.data || []);
//             } catch (err) {
//                 console.error('Error fetching posts:', err);
//             }
//         };
//         fetchPosts();
//     }, []);

//     const handleCreatePost = () => navigate('/createpost');

//     const handleLike = async (postId) => {
//         try {
//             const post = posts.find(p => p._id === postId);
//             const isLiked = post.likes?.includes(currentUserId);
//             const updatedLikes = isLiked
//                 ? post.likes.filter(id => id !== currentUserId)
//                 : [...post.likes, currentUserId];

//             await axios.put(
//                 `http://localhost:3039/api/posts/like/${postId}`,
//                 { likes: updatedLikes },
//                 {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 }
//             );

//             setPosts(prev =>
//                 prev.map(p =>
//                     p._id === postId ? { ...p, likes: updatedLikes } : p
//                 )
//             );
//         } catch (err) {
//             console.error('Like error:', err);
//         }
//     };

//     const toggleCommentBox = (postId) => {
//         setOpenComments(prev => ({
//             ...prev,
//             [postId]: !prev[postId],
//         }));
//     };

//     const handleCommentSubmit = async (postId) => {
//         const text = commentTexts[postId];
//         if (!text) return;

//         try {
//             const res = await axios.post(
//                 `http://localhost:3039/api/posts/comment/${postId}`,
//                 { text },
//                 {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 }
//             );

//             setPosts(prev =>
//                 prev.map(p =>
//                     p._id === postId
//                         ? { ...p, comments: [...(p.comments || []), res.data] }
//                         : p
//                 )
//             );
//             setCommentTexts(prev => ({ ...prev, [postId]: '' }));
//         } catch (err) {
//             console.error('Error posting comment:', err);
//         }
//     };

//     const handleDeleteComment = async (postId, commentId) => {
//         try {
//             await axios.delete(`http://localhost:3039/api/posts/delete/${commentId}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });

//             setPosts(prev =>
//                 prev.map(post =>
//                     post._id === postId
//                         ? {
//                             ...post,
//                             comments: post.comments.filter(c => c._id !== commentId),
//                         }
//                         : post
//                 )
//             );
//         } catch (err) {
//             console.error('Error deleting comment:', err);
//         }
//     };

//     const handleEditComment = async (postId, commentId) => {
//         const newText = editedCommentTexts[commentId];
//         if (!newText) return;

//         try {
//             const res = await axios.put(
//                 `http://localhost:3039/api/posts/update/${commentId}`,
//                 { text: newText },
//                 {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 }
//             );

//             setPosts(prev =>
//                 prev.map(post =>
//                     post._id === postId
//                         ? {
//                             ...post,
//                             comments: post.comments.map(comment =>
//                                 comment._id === commentId ? res.data : comment
//                             ),
//                         }
//                         : post
//                 )
//             );

//             setEditingCommentId(null);
//             navigate('/')
//         } catch (err) {
//             console.error('Error editing comment:', err);
//         }
//     };

//     const toggleCommentMenu = (commentId) => {
//         setCommentMenuOpen(prev => ({
//             ...prev,
//             [commentId]: !prev[commentId]
//         }));
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="flex justify-between items-center w-full px-8 py-6 bg-white shadow-md">
//                 <h2 className="text-3xl font-extrabold text-purple-600">SocialNest</h2>
//                 <button
//                     onClick={handleCreatePost}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium transition duration-300 shadow"
//                 >
//                     Create Post
//                 </button>
//             </div>

//             <div className="w-full max-w-2xl mt-6 px-4">
//                 {posts.length === 0 ? (
//                     <p className="text-gray-500 text-center">No posts available</p>
//                 ) : (
//                     posts.map(post => {
//                         const isLiked = post.likes?.includes(currentUserId);
//                         return (
//                             <div key={post._id} className="bg-white rounded-lg shadow-md p-4 mb-6">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <img
//                                         onClick={() => navigate(`/user/${post.user?._id}`)}
//                                         src={`http://localhost:3039${post.user?.profilepicture}`}
//                                         alt="Profile"
//                                         className="w-8 h-8 rounded-full object-cover border cursor-pointer"
//                                     />
//                                     <div className="font-semibold text-gray-800">{post.user?.username}</div>
//                                     <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
//                                 </div>

//                                 <div className="font-bold text-lg text-purple-700 mb-1">{post.caption}</div>
//                                 {post.image && (
//                                     <img
//                                         onClick={() => navigate(`/post/${post._id}`)}
//                                         src={`http://localhost:3039${post.image}`}
//                                         alt="Post"
//                                         className="w-full h-64 object-cover rounded-md mb-4 cursor-pointer"
//                                     />
//                                 )}
//                                 <div className='flex flex-row justify-between'>
//                                     <div className="text-gray-600">{post.content}</div>
//                                     <div>
//                                         <span className="text-sm text-gray-500">
//                                             {post.comments?.length || 0} comments
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-4 mt-4">
//                                     <button
//                                         onClick={() => handleLike(post._id)}
//                                         className={`text-xl ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
//                                     >
//                                         {isLiked ? '💙' : '🤍'} Like
//                                     </button>
//                                     <h3  className="text-base text-gray-600 mt-1">{post.likes?.length || 0}</h3>
//                                     <button
//                                         onClick={() => toggleCommentBox(post._id)}
//                                         className="text-sm text-purple-600"
//                                     >
//                                         💬 Comment
//                                     </button>
//                                 </div>

//                                 {openComments[post._id] && (
//                                     <div className="mt-4">
//                                         <div>
//                                             {post.comments?.length > 0 ? (
//                                                 post.comments.map(comment => (
//                                                     <div key={comment._id} className="bg-gray-100 p-2 rounded-md mb-2 relative">
//                                                         <div className="flex items-center justify-between">
//                                                             <div className="flex gap-2 items-center">
//                                                                 <img

//                                                                     src={`http://localhost:3039${comment.user?.profilepicture}`}
//                                                                     alt="Profile"
//                                                                     className="w-8 h-8 rounded-full object-cover border cursor-pointer"
//                                                                 />
//                                                                 <strong>{comment.user.username}</strong>


//                                                                 <span className="text-xs text-gray-500">
//                                                                     {new Date(comment.createdAt).toLocaleString()}
//                                                                 </span>
//                                                             </div>
//                                                             {comment.user._id === currentUserId && (
//                                                                 <div className="relative">
//                                                                     <button
//                                                                         onClick={() => toggleCommentMenu(comment._id)}
//                                                                         className="text-gray-600 text-xl font-bold px-2"
//                                                                     >
//                                                                         ⋮
//                                                                     </button>
//                                                                     {commentMenuOpen[comment._id] && (
//                                                                         <div className="absolute right-0 top-6 bg-white shadow-md rounded z-10">
//                                                                             <button
//                                                                                 onClick={() => {
//                                                                                     setEditingCommentId(comment._id);
//                                                                                     setEditedCommentTexts(prev => ({
//                                                                                         ...prev,
//                                                                                         [comment._id]: comment.text,
//                                                                                     }));
//                                                                                     setCommentMenuOpen({});

//                                                                                 }}
//                                                                                 className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
//                                                                             >
//                                                                                 Edit
//                                                                             </button>

//                                                                             <button
//                                                                                 onClick={() => {
//                                                                                     handleDeleteComment(post._id, comment._id);
//                                                                                     setCommentMenuOpen({});
//                                                                                 }}
//                                                                                 className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-200 w-full text-left"
//                                                                             >
//                                                                                 Delete
//                                                                             </button>
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             )}
//                                                         </div>

//                                                         {editingCommentId === comment._id ? (
//                                                             <>
//                                                                 <textarea
//                                                                     className="w-full mt-1 p-1 border rounded"
//                                                                     value={editedCommentTexts[comment._id] || ''}
//                                                                     onChange={(e) =>
//                                                                         setEditedCommentTexts(prev => ({
//                                                                             ...prev,
//                                                                             [comment._id]: e.target.value,
//                                                                         }))
//                                                                     }
//                                                                 />
//                                                                 <button
//                                                                     onClick={() => handleEditComment(post._id, comment._id)}
//                                                                     className="text-sm bg-blue-500 text-white px-2 py-1 rounded mt-1"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             </>
//                                                         ) : (
//                                                             <p className="mt-1">{comment.text}</p>
//                                                         )}
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <p className="text-gray-500">No comments yet</p>
//                                             )}
//                                         </div>

//                                         <div className="mt-2">
//                                             <textarea
//                                                 className="w-full p-2 rounded-md border border-gray-300"
//                                                 value={commentTexts[post._id] || ''}
//                                                 onChange={(e) =>
//                                                     setCommentTexts(prev => ({
//                                                         ...prev,
//                                                         [post._id]: e.target.value,
//                                                     }))
//                                                 }
//                                                 placeholder="Add a comment..."
//                                             />
//                                             <button
//                                                 onClick={() => handleCommentSubmit(post._id)}
//                                                 className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                                             >
//                                                 Post Comment
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Home;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [openComments, setOpenComments] = useState({});
    const [commentTexts, setCommentTexts] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentTexts, setEditedCommentTexts] = useState({});
    const [commentMenuOpen, setCommentMenuOpen] = useState({});
    const [openLikes, setOpenLikes] = useState({});
    const currentUserId = useSelector(state => state.auth.user?._id);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:3039/api/posts/all-posts');
                setPosts(res.data.data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };
        fetchPosts();
    }, []);

    const handleCreatePost = () => navigate('/createpost');

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

    const toggleCommentBox = (postId) => {
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const toggleLikesList = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3039/api/posts/likes/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPosts(prev =>
                prev.map(p =>
                    p._id === postId ? { ...p, likedUsers: res.data.users } : p
                )
            );
            setOpenLikes(prev => ({
                ...prev,
                [postId]: !prev[postId],
            }));
        } catch (err) {
            console.error('Error fetching liked users:', err);
        }
    };
    

    const handleCommentSubmit = async (postId) => {
        const text = commentTexts[postId];
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
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await axios.delete(`http://localhost:3039/api/posts/delete/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: post.comments.filter(c => c._id !== commentId),
                        }
                        : post
                )
            );
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const handleEditComment = async (postId, commentId) => {
        const newText = editedCommentTexts[commentId];
        if (!newText) return;

        try {
            const res = await axios.put(
                `http://localhost:3039/api/posts/update/${commentId}`,
                { text: newText },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: post.comments.map(comment =>
                                comment._id === commentId ? res.data : comment
                            ),
                        }
                        : post
                )
            );
            navigate('/')
            setEditingCommentId(null);
            
        } catch (err) {
            console.error('Error editing comment:', err);
        }
    };

    const toggleCommentMenu = (commentId) => {
        setCommentMenuOpen(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex justify-between items-center w-full px-8 py-6 bg-white shadow-md">
                <h2 className="text-3xl font-extrabold text-purple-600">SocialNest</h2>
                <button
                    onClick={handleCreatePost}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium transition duration-300 shadow"
                >
                    Create Post
                </button>
            </div>

            <div className="w-full max-w-2xl mt-6 px-4">
                {posts.length === 0 ? (
                    <p className="text-gray-500 text-center">No posts available</p>
                ) : (
                    posts.map(post => {
                        const isLiked = post.likes?.includes(currentUserId);
                        return (
                            <div key={post._id} className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        onClick={() => navigate(`/user/${post.user?._id}`)}
                                        src={`http://localhost:3039${post.user?.profilepicture}`}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border cursor-pointer"
                                    />
                                    <div className="font-semibold text-gray-800">{post.user?.username}</div>
                                    <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                                </div>

                                <div className="font-bold text-lg text-purple-700 mb-1">{post.caption}</div>
                                {post.image && (
                                    <img
                                        onClick={() => navigate(`/post/${post._id}`)}
                                        src={`http://localhost:3039${post.image}`}
                                        alt="Post"
                                        className="w-full h-64 object-cover rounded-md mb-4 cursor-pointer"
                                    />
                                )}
                                <div className='flex flex-row justify-between'>
                                    <div className="text-gray-600">{post.content}</div>
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            {post.comments?.length || 0} comments
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4">
                                    <div className='flex flex-row gap-4'>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`text-xl ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                                    >
                                        {isLiked ? '💙' : '🤍'} Like
                                    </button>
                                    <h3
                                        className="text-base text-gray-600 mt-1 cursor-pointer"
                                        onClick={() => toggleLikesList(post._id)}
                                    >
                                        {post.likes?.length || 0} likes
                                    </h3>

                                    </div>
                                    <div>
                                    <button
                                        onClick={() => toggleCommentBox(post._id)}
                                        className="text-sm text-purple-600 mt-2"
                                    >
                                        💬 Comment
                                    </button>

                                    </div>
                                   
                                    
                                </div>

                                {openLikes[post._id] && post.likedUsers && (
                                    <div className="mt-2 bg-gray-100 p-2 rounded-md">
                                        {post.likedUsers.map(user => (
                                            <div key={user._id} className="flex items-center gap-2 mb-2">
                                                <img
                                                    src={`http://localhost:3039${user.profilepicture}`}
                                                    alt={user.username}
                                                    className="w-8 h-8 rounded-full object-cover border"
                                                />
                                                <span className="text-gray-700 font-medium">{user.username}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Comment section remains unchanged */}

                                {openComments[post._id] && (
                                    <div className="mt-4">
                                        <div>
                                        <div className="mt-2">
                                            <textarea
                                                className="w-full p-2 rounded-md border border-gray-300"
                                                value={commentTexts[post._id] || ''}
                                                onChange={(e) =>
                                                    setCommentTexts(prev => ({
                                                        ...prev,
                                                        [post._id]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Add a comment..."
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post._id)}
                                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                Post Comment
                                            </button>
                                        </div>

                                            {post.comments?.length > 0 ? (
                                                post.comments.map(comment => (
                                                    <div key={comment._id} className="bg-gray-100 p-2 rounded-md mb-2 relative">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-2 items-center">
                                                                <img
                                                                    src={`http://localhost:3039${comment.user?.profilepicture}`}
                                                                    alt="Profile"
                                                                    className="w-8 h-8 rounded-full object-cover border cursor-pointer"
                                                                />
                                                                <strong>{comment.user.username}</strong>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(comment.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            {comment.user._id === currentUserId && (
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => toggleCommentMenu(comment._id)}
                                                                        className="text-gray-600 text-xl font-bold px-2"
                                                                    >
                                                                        ⋮
                                                                    </button>
                                                                    {commentMenuOpen[comment._id] && (
                                                                        <div className="absolute right-0 top-6 bg-white shadow-md rounded z-10">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingCommentId(comment._id);
                                                                                    setEditedCommentTexts(prev => ({
                                                                                        ...prev,
                                                                                        [comment._id]: comment.text,
                                                                                    }));
                                                                                    setCommentMenuOpen({});
                                                                                }}
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleDeleteComment(post._id, comment._id);
                                                                                    setCommentMenuOpen({});
                                                                                }}
                                                                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-200 w-full text-left"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {editingCommentId === comment._id ? (
                                                            <>
                                                                <textarea
                                                                    className="w-full mt-1 p-1 border rounded"
                                                                    value={editedCommentTexts[comment._id] || ''}
                                                                    onChange={(e) =>
                                                                        setEditedCommentTexts(prev => ({
                                                                            ...prev,
                                                                            [comment._id]: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                                <button
                                                                    onClick={() => handleEditComment(post._id, comment._id)}
                                                                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded mt-1"
                                                                >
                                                                    Save
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <p className="mt-1">{comment.text}</p>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No comments yet</p>
                                            )}
                                        </div>

                                        
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Home;