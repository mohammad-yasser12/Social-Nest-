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


app.use((req, res, next) => {
  console.log("🔥 REQUEST HIT:", req.method, req.url);
  next();
});
const allowedOrigins = [
   "http://localhost:5173",
  "https://social-nest-e4h1skoei-yasser-social-nest-project07.vercel.app",
  // Allow any vercel.app subdomain (this covers all future deployments)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Allow localhost and all vercel.app domains
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    
    console.log("Blocked by CORS:", origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(morgan("tiny"));





app.use(cookieParser());



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

