// routes/gmail.routes.js
import express from "express";
import {
  getInbox,
  getSent,
  getTrash,
  getSpam,
} from "../controllers/gmail.controller.js";

const router = express.Router();

router.get("/inbox", getInbox);
router.get("/sent", getSent);
router.get("/trash", getTrash);
router.get("/spam", getSpam);

export default router;
