// views/layout.template.js

export function renderLayout({ title = "Gmail OAuth Demo", userEmail = "", content = "" }) {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #f4f6f8;">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">📧 Gmail OAuth Demo</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Bandejas
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/inbox">📥 Inbox</a></li>
                <li><a class="dropdown-item" href="/sent">📤 Enviados</a></li>
                <li><a class="dropdown-item" href="/trash">🗑️ Eliminados</a></li>
                <li><a class="dropdown-item" href="/spam">🚫 Spam</a></li>
              </ul>
            </li>
          </ul>
          ${
            userEmail
              ? `<span class="navbar-text text-light">👤 ${userEmail}</span>`
              : ""
          }
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      ${content}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </body>
  </html>
  `;
}
