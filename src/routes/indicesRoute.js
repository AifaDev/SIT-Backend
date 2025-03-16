// src/routes/indicesRoute.js
import { Router } from "express";
import {
  getAllIndices,
  getIndexById,
  getIndicesReleases,
  getIndicesCountries,
} from "../controllers/indicesController.js";

const router = Router();

router.get("/", getAllIndices);
router.get("/releases", getIndicesReleases);
router.get("/countries", getIndicesCountries);
router.get("/:id", getIndexById);

export default router;
