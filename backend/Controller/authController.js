import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Model/userModel.js';
import Post from '../Model/postModel.js';
import FollowRequest from '../Model/FollowRequest.js';
import Notification from '../Model/notificationModel.js';
import cloudinary from "../config/cloudinary.js";




export const signup = async (req, res) => {
  try {
    console.log("🔥 SIGNUP HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { username, email, password } = req.body;

    console.log("STEP 1 OK");

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("STEP 2 OK");

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilepicture: req.file?.path || "",
    });

    console.log("STEP 3 OK");

    const token = jwt.sign(
      { user_id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("STEP 4 OK");

    return res.status(201).json({
      message: "Signup successful",
      user: newUser,
      token,
    });

  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token with 7-day expiry
    // const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // In login controller
    const token = jwt.sign(
      { user_id: user._id }, // ✅ consistent naming
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    // Exclude password before sending user data
    const { password: pwd, ...userData } = user._doc;

    // Send token and user details
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: userData,
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};


export const getUserProfile = async (req, res) => {
  try {
      const userId = req.params.id;

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

      res.status(200).json({ user, posts });
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
};







export const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = { username };

    // If new image uploaded
    if (req.file) {
      // OPTIONAL: delete old image from cloudinary
      if (user.profilepicture) {
        const parts = user.profilepicture.split("/");
        const file = parts[parts.length - 1];
        const publicId = file.split(".")[0];

        await cloudinary.uploader.destroy(`socialnest/${publicId}`);
      }

      updateData.profilepicture = req.file.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.profilepicture) {
      return res.status(404).json({ error: "No profile picture to delete" });
    }

    // Delete from Cloudinary
    const parts = user.profilepicture.split("/");
    const file = parts[parts.length - 1];
    const publicId = file.split(".")[0];

    await cloudinary.uploader.destroy(`socialnest/${publicId}`);

    // Remove from DB
    user.profilepicture = "";
    await user.save();

    res.status(200).json({
      message: "Profile picture deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting profile picture" });
  }
};


export const getUserWithPosts = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      const posts = await Post.find({ user: req.params.id });

      const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
      const totalPosts = posts.length;

      res.status(200).json({
          user,
          posts,
          totalLikes,
          totalPosts,
      });
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
};

// POST /api/auth/follow/:id
export const followUser = async (req, res) => {
  try {
    const senderId = req.user.user_id;
    const receiverId = req.params.id;

    // check existing request
    const existing = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Request already exists",
      });
    }

    const request = await FollowRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Follow failed" });
  }
};

// POST /api/auth/unfollow/:id
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.user_id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    // optional: delete request
    await FollowRequest.findOneAndDelete({
      sender: currentUserId,
      receiver: targetUserId,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Unfollow failed" });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.user_id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
    }).select("username email profilepicture");

    const usersWithFollowStatus = await Promise.all(
      users.map(async (user) => {
        const request = await FollowRequest.findOne({
          sender: currentUserId,
          receiver: user._id,
        });

        let followStatus = "none";

        if (request) {
          followStatus = request.status; // pending / accepted / rejected
        }

        return {
          ...user.toObject(),
          followStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithFollowStatus,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate("followers", "username profilepicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user.followers,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching followers" });
  }
};




// ================= ACCEPT REQUEST =================
// POST /api/auth/accept/:requestId
export const acceptFollowRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await FollowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { following: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { followers: request.sender },
    });

    res.json({
      success: true,
      message: "Request accepted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Accept failed" });
  }
};
// ================= REJECT REQUEST =================
// POST /api/auth/reject/:requestId
export const rejectFollowRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await FollowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Reject failed" });
  }
};
// ================= GET FOLLOW REQUESTS =================
export const getFollowRequests = async (req, res) => {
  try {
    const userId = req.user.user_id; // from JWT middleware

    const requests = await FollowRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "username profilepicture") // show sender details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const requests = await FollowRequest.find({
      sender: userId,
    })
      .populate("receiver", "username profilepicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const cancelFollowRequest = async (req, res) => {
  try {
    console.log("senderId:", req.user.user_id);
    console.log("receiverId:", req.params.id);

    const deleted = await FollowRequest.findOneAndDelete({
      sender: req.user.user_id,
      receiver: req.params.id,
      status: "pending",
    });

    console.log("deleted:", deleted);

    res.json({
      success: true,
      message: "Request cancelled",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const notifications = await Notification.find({
      user: userId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.user_id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // 🔐 Security check (VERY IMPORTANT)
    if (notification.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Mark as read
    notification.isRead = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};