// src/controllers/indicesController.js

import { loadIndices } from "../models/indicesModel.js";
import { sortIndicesByLatestRankDate } from "../services/sortService.js";

export function getAllIndices(req, res) {
  // Load data
  let indices = loadIndices();

  // Check if a 'sort' query param is provided, e.g. GET /api/indices?sort=xxx
  const { sort } = req.query;

  if (sort) {
    // FUTURE: If `sort` matches your new sorting method, call it here.
    // For now, we do nothing—just a placeholder.
    // Example:
    // if (sort === "someFutureSort") {
    //   indices = someFutureSortFunction(indices);
    // }
    // Otherwise, if the param is unknown or blank, we could just
    // default to your standard approach:
    // else {
    //   indices = sortIndicesByLatestRankDate(indices);
    // }
  } else {
    // No 'sort' param → use your default sort
    indices = sortIndicesByLatestRankDate(indices);
  }

  // Return the (sorted) data
  return res.status(200).json(indices);
}

export function getIndexById(req, res) {
  const { id } = req.params;
  const indices = loadIndices();
  const index = indices.find((item) => item.index === parseInt(id, 10));

  if (!index) {
    return res.status(404).json({ error: "Index not found" });
  }
  return res.status(200).json(index);
}
