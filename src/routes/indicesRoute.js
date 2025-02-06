// src/routes/indicesRoute.js
import { Router } from "express";
import {
  getAllIndices,
  getIndexById,
} from "../controllers/indicesController.js";

const router = Router();

// GET /api/indices
router.get("/", getAllIndices);

// GET /api/indices/:id (optional)
router.get("/:id", getIndexById);

export default router;
