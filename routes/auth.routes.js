import express from "express";
import {
  redirectToGoogle,
  handleOAuthCallback,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", redirectToGoogle);
router.get("/oauth2callback", handleOAuthCallback);
router.get("/logout", logoutUser);

export default router;
//
