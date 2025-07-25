// controllers/gmail.controller.js
import { getGmailClient, getUserEmail, listMessagesByLabel } from "../services/gmail.service.js";
import { renderLayout } from "../views/layout.template.js";

async function renderMailbox(req, res, labelId, title) {
  try {
    const tokens = req.tokens;
    const gmail = getGmailClient(tokens);
    const userEmail = await getUserEmail(gmail);
    const messages = await listMessagesByLabel(gmail, labelId);

    const content = `
      <h2>${title}</h2>
      ${messages
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
    console.error(`❌ Error al cargar ${title}:`, error);
    res.status(500).send("Ocurrió un error al obtener los correos.");
  }
}

export function getInbox(req, res) {
  return renderMailbox(req, res, "INBOX", "📥 Bandeja de entrada");
}

export function getSent(req, res) {
  return renderMailbox(req, res, "SENT", "📤 Correos enviados");
}

export function getTrash(req, res) {
  return renderMailbox(req, res, "TRASH", "🗑️ Elementos eliminados");
}

export function getSpam(req, res) {
  return renderMailbox(req, res, "SPAM", "🚫 Correos spam");
}
