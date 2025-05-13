// src/pages/EditProfilePicture.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const EditProfilePicture = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [profilePicture, setProfilePicture] = useState(null);
//     const [currentImage, setCurrentImage] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:3039/api/auth/${id}`);
//                 setUsername(res.data.user.username);
//                 setCurrentImage(res.data.user.profilepicture);
//             } catch (err) {
//                 console.error('Error fetching user', err);
//             }
//         };
//         fetchUser();
//     }, [id]);

//     const handleImageChange = (e) => {
//         setProfilePicture(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         if (profilePicture) {
//             formData.append('profilepicture', profilePicture);
//         }
//         formData.append('username', username);

//         try {
//             await axios.put(
//                 `http://localhost:3039/api/auth/update-profile-picture/${id}`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );
//             alert('Profile updated');
//             navigate('/');
//         } catch (err) {
//             console.error('Failed to update profile', err);
//         }
//     };

//     const handleCancel = () => {
//         // Example: Reset form fields
//         setUsername(user.username); // reset username
//         setSelectedFile(null);      // clear file selection
//         setPreview(user.profilepicture); // reset image preview

//         // Optional: navigate away or close edit mode
//         // navigate('/dashboard'); or setIsEditing(false);
//     };


//     return (
//         <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded">
//             <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block mb-1 font-medium">Current Profile Picture</label>
//                     <img
//                         src={
//                             currentImage
//                                 ? `http://localhost:3039${currentImage}`
//                                 : '/default-profile.jpg'
//                         }
//                         alt="Current"
//                         className="w-24 h-24 rounded-full object-cover border mb-2"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 font-medium">New Profile Picture</label>
//                     <input type="file" accept="image/*" onChange={handleImageChange} />
//                 </div>

//                 <div>
//                     <label className="block mb-1 font-medium">Username</label>
//                     <input
//                         type="text"
//                         className="border rounded w-full px-3 py-2"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                     Save Changes
//                 </button>
//                 <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//             >
//                 Cancel
//             </button>

//             </form>
            
//         </div>
//     );
// };

// export default EditProfilePicture;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProfilePicture = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState('');
    const [initialPreview, setInitialPreview] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3039/api/auth/${id}`);
                const user = res.data.user;
                setUsername(user.username);
                setInitialUsername(user.username);
                setPreview(`http://localhost:3039${user.profilepicture}`);
                setInitialPreview(`http://localhost:3039${user.profilepicture}`);
            } catch (err) {
                console.error('Error fetching user', err);
            }
        };
        fetchUser();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (profilePicture) {
            formData.append('profilepicture', profilePicture);
        }
        formData.append('username', username);

        try {
            await axios.put(
                `http://localhost:3039/api/auth/update-profile-picture/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            alert('Profile updated');
            navigate('/');
        } catch (err) {
            console.error('Failed to update profile', err);
        }
    };

    const handleCancel = () => {
        setUsername(initialUsername);         // Reset to original username
        setProfilePicture(null);              // Clear selected file
        setPreview(initialPreview); 
        navigate('/');          // Reset image preview
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Current Profile Picture</label>
                    <img
                        src={preview || '/default-profile.jpg'}
                        alt="Current"
                        className="w-24 h-24 rounded-full object-cover border mb-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">New Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        className="border rounded w-full px-3 py-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePicture;

