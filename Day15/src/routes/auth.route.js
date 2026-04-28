import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Path: /api/auth/login
// Path: /api/auth/register

router.post("/login", authController.login);

router.post("/register", authController.register);

export default router;
