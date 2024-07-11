import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();



const app = express();


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("database connecttion successful"))
.catch((err)=>console.log(err));

app.use(express.json());

app.use("/test", userRouter);
app.use("/api", authRouter);




app.listen(3000, ()=>{
    console.log("Server is running on 3000");
})