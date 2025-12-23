import express from "express";

import {
  addmachine,
  allmachines,
  deletemachines,
  editmachine,
} from "../Controllers/MachineController.js";

import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/addmachine", ensureAuthenticated, addmachine);
router.post("/allmachine", ensureAuthenticated, allmachines);
router.delete("/deletemachine", ensureAuthenticated, deletemachines);
router.put("/editmachine", ensureAuthenticated, editmachine);

export default router;
