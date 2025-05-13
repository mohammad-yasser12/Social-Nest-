import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    profilepicture: {
      type: String,
      required:false,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // added
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // added
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],  // optional tracking
    sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // optional tracking
    date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
