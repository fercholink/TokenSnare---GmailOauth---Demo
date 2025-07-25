// app.js
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import gmailRoutes from "./routes/gmail.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware de archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware de sesión
app.use(
  session({
    secret: "clave-secreta-gmail-demo", // cámbiala en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Middleware para insertar tokens de sesión en req.tokens
app.use((req, res, next) => {
  if (req.session.tokens) {
    req.tokens = req.session.tokens;
  }
  next();
});

// Rutas principales
app.use("/", authRoutes);
app.use("/", gmailRoutes);

// Ruta de prueba
app.get("/ping", (req, res) => res.send("pong"));

export default app;
