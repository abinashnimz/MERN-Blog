import express from "express";
import {signup, signin, google} from "../controllers/auth.controller.js";
import { signupSchema } from "../validators/auth.validation.js";
import validator from "../middleware/validation.middleware.js";
const router = express.Router();


router.post("/signup", validator(signupSchema), signup);
router.post("/signin", signin);
router.post("/google", google);

export default router;
