import express from "express";
import { error } from "../controllers/error.controller.js"
const router = express.Router();

router.get("*", error);

export default router;