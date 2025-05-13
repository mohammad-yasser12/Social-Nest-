import express, { urlencoded } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./Router/authRouter.js";
import postRouter from './Router/postRouter.js';




import { fileURLToPath } from 'url';
import path from 'path';


// Serve uploads folder






dotenv.config();

const PORT = process.env.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(urlencoded({ extended: true }));
app.use(
    cors({
      origin: "http://localhost:5173", // Your frontend URL
      credentials: true, // Allow cookies and authentication headers
    })
  );

  

app.use(morgan("tiny"));

// app.use(express.static("public"));
// app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


connectToDatabase()
    .then(() => {
        console.log("connected to mongodb");

    })
    .catch((error) => {
        console.log("database connection failed", error);

    })

   
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);

})

