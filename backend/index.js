import express, { urlencoded } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./Router/authRouter.js";
import postRouter from './Router/postRouter.js';
import messageRouter from "./Router/MessageRouter.js";






// Serve uploads folder







dotenv.config();

const PORT = process.env.PORT || 3039;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://social-nest-seven.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
  

app.use(morgan("tiny"));
app.options("*", cors());




app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/message', messageRouter);


connectToDatabase()
    .then(() => {
        console.log("connected to mongodb");

    })
    .catch((error) => {
        console.log("database connection failed", error);

    })


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

