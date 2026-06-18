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




const allowedOrigins = [
  "http://localhost:5173",
  "https://social-nest-1t3tqwpod-yasser-social-nest-project07.vercel.app",
  "https://social-nest-1-flyx.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", cors());
app.use(morgan("tiny"));





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

