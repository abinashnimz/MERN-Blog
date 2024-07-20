import express from "express";
import { test, updateUser, deleteUser, signoutUser } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verifyUser.middleware.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signoutUser);

export default router;