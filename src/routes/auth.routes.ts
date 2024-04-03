import { Router } from "express";
import { userLoginController, userSignUpController } from "../controllers/auth.controllers";

const authRoutes = Router();

authRoutes.post("/login", userLoginController);
authRoutes.post("/signup", userSignUpController);

export default authRoutes;
