import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const URI=process.env.MONGO_URI;

export const connectDB = async ()=>{
    try{
        await mongoose.connect(URI);
        console.log("Database Connection Successful.");
    }catch(err){
        console.error("Database connection Failed.");
        process.exit(0);
    }
}

