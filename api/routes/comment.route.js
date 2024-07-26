import express from "express";
import { verifyToken } from "../middleware/verifyUser.middleware.js";
import { createComment, getComments, likeComment } from "../controllers/comment.controller.js";


const route = express.Router();

route.post("/create", verifyToken, createComment);
route.get("/getcomments/:postId", getComments);
route.put("/likecomment/:commentId", verifyToken, likeComment);

export default route;