// controllers/gmail.controller.js
import {
  getGmailClient,
  getMessageMetadata,
  getUserEmail,
  listMessagesByLabel,
} from "../services/gmail.service.js";
import path from "path";
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
        <strong>Fecha:</strong> ${msg.date}<br>
        <a href="/message/${msg.id}" class="btn btn-sm btn-primary mt-2">Ver detalles</a>
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
  return renderMailbox(req, res, "INBOX", "Bandeja de entrada");
}

export function getSent(req, res) {
  return renderMailbox(req, res, "SENT", "Correos enviados");
}

export function getTrash(req, res) {
  return renderMailbox(req, res, "TRASH", "Elementos eliminados");
}

export function getSpam(req, res) {
  return renderMailbox(req, res, "SPAM", "Correos spam");
}

export async function getAttachmentsView(req, res) {
  try {
    const tokens = req.tokens;
    const messageId = req.params.id;

    const gmail = getGmailClient(tokens);

    // Obtener mensaje completo
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    // Extraer adjuntos
    const attachments = [];
    const parts = message.data.payload.parts || [];

    const traverseParts = (parts) => {
      for (const part of parts) {
        if (part.filename && part.body && part.body.attachmentId) {
          attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            attachmentId: part.body.attachmentId,
          });
        }
        if (part.parts) traverseParts(part.parts);
      }
    };

    traverseParts(parts);

    const content = `
  <h2>📎 Adjuntos del mensaje</h2>
  <p><strong>Mensaje ID:</strong> ${messageId}</p>

  ${
    attachments.length > 0
      ? `
    <ul class="list-group mb-3">
      ${attachments
        .map(
          (a) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${a.filename}
          <a href="/attachments/${messageId}/download/${a.attachmentId}" class="btn btn-sm btn-primary">Descargar</a>
        </li>`
        )
        .join("")}
    </ul>
  `
      : `
    <div class="alert alert-warning mb-3" role="alert">
      Este mensaje no contiene archivos adjuntos.
    </div>
  `
  }

  <a href="/inbox" class="btn btn-secondary">⬅️ Volver a la bandeja</a>
`;

    res.send(renderLayout({ content }));
  } catch (error) {
    console.error("❌ Error al obtener adjuntos:", error);
    res.status(500).send("Error al obtener adjuntos del mensaje.");
  }
}

export async function downloadAttachmentFile(req, res) {
  try {
    const tokens = req.tokens;
    const { id: messageId, attachmentId } = req.params;
    const gmail = getGmailClient(tokens);

    // Obtener mensaje completo para buscar el filename
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const parts = message.data.payload.parts || [];

    let filename = `attachment-${attachmentId}.bin`;

    const findFilename = (parts) => {
      for (const part of parts) {
        if (part.body && part.body.attachmentId === attachmentId) {
          if (part.filename) {
            filename = part.filename;
            console.log("🚀 ~ findFilename ~ filename:", filename)
            break;
          }
        }
        if (part.parts) {
          findFilename(part.parts);
        }
      }
    };

    findFilename(parts);

    // Obtener datos binarios del adjunto
    const attachment = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId,
      id: attachmentId,
    });

    const data = attachment.data.data;
    const buffer = Buffer.from(data, "base64");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (error) {
    console.error("❌ Error al descargar adjunto:", error);
    res.status(500).send("No se pudo descargar el archivo adjunto.");
  }
}

export async function getMessageDetails(req, res) {
  try {
    const tokens = req.tokens;
    const messageId = req.params.id;

    const gmail = getGmailClient(tokens);
    const metadata = await getMessageMetadata(gmail, messageId);

    if (!metadata) {
      return res.status(404).send("Mensaje no encontrado.");
    }

    const content = `
      <h2>Detalles del mensaje</h2>
      <p><strong>ID:</strong> ${metadata.id}</p>
      <p><strong>Asunto:</strong> ${metadata.subject}</p>
      <p><strong>Remitente:</strong> ${metadata.from}</p>
      <p><strong>Fecha:</strong> ${metadata.date}</p>
      <a href="/attachments/${messageId}" class="btn btn-secondary">Ver adjuntos</a>
    `;

    res.send(renderLayout({ content }));
  } catch (error) {
    console.error("❌ Error al obtener detalles del mensaje:", error);
    res.status(500).send("Error al obtener detalles del mensaje.");
  }
}
