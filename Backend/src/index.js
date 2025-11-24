import express from "express";
import dotenv from "dotenv";
import sequelize from "./db.js";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import teamRoutes from "./routes/teams.js";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",   // frontend URL
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

// Basic health
app.get("/health", (req, res) => res.json({ ok: true }));

// DB connect & server start using PORT from .env
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
})();
