import express from "express";
import { verifyToken } from "../middleware/verifyUser.middleware.js";
import { post } from "../controllers/post.controller.js";
const route = express.Router();

route.post("/create", verifyToken, post);

export default route;