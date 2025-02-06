// src/app.js
import express from "express";
import cors from "cors";
import indicesRoute from "./routes/indicesRoute.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/indices", indicesRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Global Indices API is running (ESM version)!");
});

export default app;
