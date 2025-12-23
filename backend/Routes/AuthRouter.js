import express from "express";

import { signup, login } from "../Controllers/AuthController.js";
import {
  signupvalidation,
  loginvalidation
} from "../Middlewares/AuthValidation.js";

const router = express.Router();

router.post("/login", loginvalidation, login);
router.post("/signup", signupvalidation, signup);

export default router;
