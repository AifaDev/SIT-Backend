// src/routes/indicesRoute.js
import { Router } from "express";
import {
  getAllIndices,
  getIndexById,
  getIndicesReleases,
  getIndicesCountries,
} from "../controllers/indicesController.js";

const router = Router();

// GET /api/indices
router.get("/", getAllIndices);
router.get("/releases", getIndicesReleases);
router.get("/countries", getIndicesCountries);

// GET /api/indices/:id (optional)
router.get("/:id", getIndexById);

export default router;
