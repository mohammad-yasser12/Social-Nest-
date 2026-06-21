import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../Model/postModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIX ENV PATH
import fs from "fs";

const envPath = path.join(__dirname, "../.env");

console.log("ENV PATH:", envPath);
console.log("FILE EXISTS:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

const run = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB Connected");

    const posts = await Post.find();

    for (let post of posts) {
      if (post.image?.startsWith("/uploads/")) {
        post.image = post.image.replace("/uploads/", "");
        await post.save();
        console.log(`Fixed: ${post._id}`);
      }
    }

    console.log("Done ✔");
    process.exit();
  } catch (err) {
    console.error("Migration Error:", err);
    process.exit(1);
  }
};

run();