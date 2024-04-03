import { Router } from "express";
import {
  userLoginController,
  userSignUpController,
} from "../controllers/auth.controllers";
import { errorHandler } from "../error.handler";

const authRoutes = Router();

authRoutes.post("/login", errorHandler(userLoginController));
authRoutes.post("/signup", errorHandler(userSignUpController));

export default authRoutes;
