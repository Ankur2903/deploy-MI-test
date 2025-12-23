import express from "express";

import {
  addenquirie,
  allenquiries,
  deleteenquirie,
  editenquirie,
} from "../Controllers/enquiriesController.js";

import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/addenquirie", ensureAuthenticated, addenquirie);
router.post("/allenquiries", ensureAuthenticated, allenquiries);
router.delete("/deleteenquirie", ensureAuthenticated, deleteenquirie);
router.put("/editenquirie", ensureAuthenticated, editenquirie);

export default router;
