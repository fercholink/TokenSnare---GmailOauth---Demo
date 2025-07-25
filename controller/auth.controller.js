// controllers/auth.controller.js
import { google } from "googleapis";
import {
  getGmailClient,
  getUserEmail,
  sendDemoEmail,
  getMessageMetadata,
  listMessagesByLabel,
} from "../services/gmail.service.js";
import { renderLayout } from "../views/layout.template.js";

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
}

export function redirectToGoogle(req, res) {
  const oauth2Client = createOAuthClient();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
    prompt: "consent",
  });

  res.redirect(authUrl);
}

export async function handleOAuthCallback(req, res) {
  const code = req.query.code;
  const oauth2Client = createOAuthClient();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;

    const gmail = getGmailClient(tokens);
    const userEmail = await getUserEmail(gmail);

    const sentId = await sendDemoEmail(gmail, userEmail);
    const sentMeta = await getMessageMetadata(gmail, sentId);
    const inbox = await listMessagesByLabel(gmail, "INBOX");

    const content = `
      <h2>✅ Acceso concedido</h2>
      <p>Esta aplicación ahora puede leer y enviar correos como tú.</p>

      <h4>📤 Correo enviado por la demo:</h4>
      <div class="card mb-3 border-warning">
        <div class="card-body">
          <strong>Asunto:</strong> ${sentMeta.subject}<br>
          <strong>Remitente:</strong> ${sentMeta.from}<br>
          <strong>Fecha:</strong> ${sentMeta.date}
        </div>
      </div>

      <h4>📥 Últimos 5 correos (Inbox):</h4>
      ${inbox
        .map(
          (msg) => `
        <div class="card mb-2">
          <div class="card-body">
            <strong>Asunto:</strong> ${msg.subject}<br>
            <strong>Remitente:</strong> ${msg.from}<br>
            <strong>Fecha:</strong> ${msg.date}
          </div>
        </div>`
        )
        .join("")}
    `;

    res.send(renderLayout({ userEmail, content }));
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    res.status(500).send("Ocurrió un error durante la autenticación.");
  }
}
// controllers/auth.controller.js
// ...otros imports...

export function logoutUser(req, res) {
  req.session = null; // elimina toda la sesión
  res.redirect("/"); // redirige al inicio (vuelve a pedir autorización)
}
