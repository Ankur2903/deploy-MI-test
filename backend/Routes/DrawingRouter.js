const { addDrawing, allDrawings, deleteDrawing, editDrawing } = require('../Controllers/drawingController');
const ensureAuthenticated = require('../Middlewares/Auth');

<<<<<<< HEAD
const router = require('express').Router();
router.post('/adddrawing', ensureAuthenticated, addDrawing);
router.post('/alldrawings', ensureAuthenticated, allDrawings);
router.delete('/deletedrawing', ensureAuthenticated, deleteDrawing);
router.put('/editdrawing', ensureAuthenticated, editDrawing);
module.exports = router;
=======
import {
  addDrawing,
  allDrawings,
  deleteDrawing,
  editDrawing,
} from "../Controllers/drawingController.js";

import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/adddrawing", ensureAuthenticated, addDrawing);
router.post("/alldrawings", ensureAuthenticated, allDrawings);
router.delete("/deletedrawing", ensureAuthenticated, deleteDrawing);
router.put("/editdrawing", ensureAuthenticated, editDrawing);

export default router;
>>>>>>> 1c33eca054996dc181fb3b0d593890fc8646934c
