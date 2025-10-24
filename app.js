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

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "clave-secreta-gmail-demo",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  if (req.session.tokens) {
    req.tokens = req.session.tokens;
  }
  next();
});

app.use("/", authRoutes);
app.use("/", gmailRoutes);

app.get("/ping", (req, res) => res.send("pong"));

export default app;
