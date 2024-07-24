import express from "express";
import { testuser, updateUser, deleteUser, signoutUser } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verifyUser.middleware.js";

const router = express.Router();

router.route("/testuser").get(testuser);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signoutUser);

export default router;