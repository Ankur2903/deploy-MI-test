import express from "express";

import {
  addmaterial,
  allmaterial,
  deletematerial,
  editmaterial,
} from "../Controllers/MaterialController.js";

import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/addmaterial", ensureAuthenticated, addmaterial);
router.post("/allmaterials", ensureAuthenticated, allmaterial);
router.delete("/deletematerial", ensureAuthenticated, deletematerial);
router.put("/editmaterial", ensureAuthenticated, editmaterial);

export default router;
