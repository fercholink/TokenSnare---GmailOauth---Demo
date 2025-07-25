// services/gmail.service.js
import { google } from "googleapis";
// Función para construir el correo en formato RFC2822
import { makeBody } from "../utils/makeBody.js";

export function getGmailClient(tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: "v1", auth: oauth2Client });
}

export async function getUserEmail(gmail) {
  const profile = await gmail.users.getProfile({ userId: "me" });
  return profile.data.emailAddress;
}

export async function sendDemoEmail(gmail, email) {
  const rawMessage = makeBody(
    email,
    email,
    "Correo enviado por esta demo",
    "Hola, este mensaje fue enviado automáticamente por una app usando tus permisos OAUTH."
  );

  const sent = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: rawMessage },
  });

  return sent.data.id;
}

export async function getMessageMetadata(gmail, messageId) {
  const message = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "metadata",
    metadataHeaders: ["Subject", "From", "Date"],
  });

  const headers = message.data.payload.headers;
  return {
    subject: headers.find((h) => h.name === "Subject")?.value || "(Sin asunto)",
    from: headers.find((h) => h.name === "From")?.value || "(Sin remitente)",
    date: headers.find((h) => h.name === "Date")?.value || "(Sin fecha)",
  };
}

export async function listMessagesByLabel(gmail, labelId, maxResults = 5) {
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: [labelId],
    maxResults,
  });

  const messages = response.data.messages || [];
  const metadataList = [];

  for (const msg of messages) {
    const meta = await getMessageMetadata(gmail, msg.id);
    metadataList.push(meta);
  }

  return metadataList;
}
