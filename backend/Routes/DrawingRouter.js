import express from "express";

import {
  addDrawing,
  allDrawings,
  deleteDrawing,
  editDrawing,
} from "../Controllers/DrawingController.js";

import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/adddrawing", ensureAuthenticated, addDrawing);
router.post("/alldrawings", ensureAuthenticated, allDrawings);
router.delete("/deletedrawing", ensureAuthenticated, deleteDrawing);
router.put("/editdrawing", ensureAuthenticated, editDrawing);

export default router;
