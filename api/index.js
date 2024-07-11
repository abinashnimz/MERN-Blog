import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();



const app = express();


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("database connecttion successful"))
.catch((err)=>console.log(err));




app.listen(3000, ()=>{
    console.log("Server is running on 3000");
})