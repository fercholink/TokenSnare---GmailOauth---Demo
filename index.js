// index.js
import express from "express";
import { google } from "googleapis";
import open from "open";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

let oauth2Client;

// Scopes solicitados (lectura y envío de correos)
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

// Función para construir el correo en formato RFC2822
function makeBody(to, from, subject, message) {
  const str = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Cargar credenciales desde archivo JSON
async function setupOAuth() {
  const content = await fs.readFile("credentials.json", "utf8");
  const credentials = JSON.parse(content).web;

  const redirectUri =
    process.env.REDIRECT_URI || "http://localhost:3000/oauth2callback";

  oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    redirectUri
  );
}

await setupOAuth();

// Ruta principal: redirige al login de Google
app.get("/", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  res.redirect(authUrl);
});

// Ruta de redirección: obtiene tokens, envía y lee correos
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Obtener el correo del usuario autenticado
    const profile = await gmail.users.getProfile({ userId: "me" });
    const userEmail = profile.data.emailAddress;

    // Crear y enviar correo
    const rawMessage = makeBody(
      userEmail,
      userEmail,
      "💥 Correo enviado por esta demo",
      "Hola, este mensaje fue enviado automáticamente por una app usando tus permisos OAUTH."
    );

    const sentResponse = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    const sentMessageId = sentResponse.data.id;

    // Leer el mensaje enviado
    const sentMsgData = await gmail.users.messages.get({
      userId: "me",
      id: sentMessageId,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "Date"],
    });

    const sentHeaders = sentMsgData.data.payload.headers;
    const sentSubject =
      sentHeaders.find((h) => h.name === "Subject")?.value || "(Sin asunto)";
    const sentFrom =
      sentHeaders.find((h) => h.name === "From")?.value || "(Sin remitente)";
    const sentDate =
      sentHeaders.find((h) => h.name === "Date")?.value || "(Sin fecha)";

    let emailInfo = `
      <h3>📬 Últimos correos (incluyendo el enviado):</h3>
      <div style="margin-bottom: 1em; border: 2px solid #ff9800; padding: 10px; background: #fff8e1;">
        <strong>📤 Correo enviado por esta aplicación</strong><br>
        <strong>Asunto:</strong> ${sentSubject}<br>
        <strong>Remitente:</strong> ${sentFrom}<br>
        <strong>Fecha:</strong> ${sentDate}
      </div>
    `;

    // Obtener los últimos 5 mensajes del inbox
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
      labelIds: ["INBOX"],
    });

    const messages = response.data.messages || [];

    for (const msg of messages) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });

      const headers = msgData.data.payload.headers;
      const subject =
        headers.find((h) => h.name === "Subject")?.value || "(Sin asunto)";
      const from =
        headers.find((h) => h.name === "From")?.value || "(Sin remitente)";
      const date =
        headers.find((h) => h.name === "Date")?.value || "(Sin fecha)";

      emailInfo += `
        <div style="margin-bottom: 1em;">
          <strong>Asunto:</strong> ${subject}<br>
          <strong>Remitente:</strong> ${from}<br>
          <strong>Fecha:</strong> ${date}
        </div>
      `;
    }

    res.send(`
      <h2>✅ Acceso concedido</h2>
      <p>Esta aplicación ahora puede leer y enviar correos como tú.</p>
      <h3>🔑 Tokens obtenidos:</h3>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
      <hr>
      ${emailInfo}
      <hr>
      <p>¿Notas que no fue necesario usar tu contraseña?</p>
    `);
  } catch (error) {
    console.error("❌ Error al obtener token o correos:", error);
    res
      .status(500)
      .send("Ocurrió un error al obtener el token o leer correos.");
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    open(`http://localhost:${PORT}`);
  }
});
