import express from "express";
import {
  getInbox,
  getSent,
  getTrash,
  getSpam,
  getAttachmentsView,
  downloadAttachmentFile,
  getMessageDetails
} from "../controllers/gmail.controller.js";

const router = express.Router();

router.get("/inbox", getInbox);
router.get("/sent", getSent);
router.get("/trash", getTrash);
router.get("/spam", getSpam);
router.get("/message/:id", getMessageDetails); // muestra metadata + botón "Ver adjuntos"
router.get("/attachments/:id", getAttachmentsView);
router.get("/attachments/:id/download/:attachmentId", downloadAttachmentFile);

export default router;
