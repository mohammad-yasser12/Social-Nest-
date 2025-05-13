import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DB_URL;
const connectToDatabase  = async () =>{
    try {
        await mongoose.connect(dbUrl,
            console.log("connected to mongodb with mongoose")
            
        );

    }catch (error){
        console.error("mongoose connection error:",error);
        
    }
};
export default connectToDatabase;