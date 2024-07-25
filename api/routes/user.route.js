import express from "express";
import { testuser, updateUser, deleteUser, signoutUser, getUsers, getUser } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verifyUser.middleware.js";

const router = express.Router();

router.route("/testuser").get(testuser);
router.get("/getusers", verifyToken, getUsers);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signoutUser);
router.get("/:userId", getUser);

export default router;