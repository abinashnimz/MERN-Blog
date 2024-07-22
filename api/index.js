import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import errorRouter from "./routes/error.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import {connectDB} from "./utils/db.js";


const PORT = process.env.PORT;

const app = express();
app.use(cookieParser());


app.use(express.json());

app.use("*", errorRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.use(errorMiddleware);
connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port no: ${PORT}`);
    })
});