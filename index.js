// index.js
import app from "./app.js";
import open from "open";
import session from "express-session";

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: "demo_gmail_secret", // puedes usar un valor más seguro
    resave: false,
    saveUninitialized: true,
  })
);

app.listen(PORT, "0.0.0.0", () => {
  showBanner();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    open(`http://localhost:${PORT}`);
  }
});

function showBanner() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    Gmail OAUTH DEMO                                          ║
║    by Ricardo Medina                                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
}
