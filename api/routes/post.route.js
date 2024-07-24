import express from "express";
import { verifyToken } from "../middleware/verifyUser.middleware.js";
import { post, getposts, deletepost, updatepost } from "../controllers/post.controller.js";
const route = express.Router();

route.get("/getposts", getposts);
route.post("/create", verifyToken, post);
route.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
route.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default route;