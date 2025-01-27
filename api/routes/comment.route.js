import express from "express";
import { verifyToken } from "../middleware/verifyUser.middleware.js";
import { createComment, getComments, likeComment, editComment, deleteComment, getAllComments } from "../controllers/comment.controller.js";


const route = express.Router();

route.post("/create", verifyToken, createComment);
route.get("/getcomments/:postId", getComments);
route.put("/likecomment/:commentId", verifyToken, likeComment);
route.put("/editcomment/:commentId", verifyToken, editComment);
route.delete("/deletecomment/:commentId", verifyToken, deleteComment);
route.get("/getallcomments", verifyToken, getAllComments);

export default route;