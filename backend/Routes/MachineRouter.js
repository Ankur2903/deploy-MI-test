const { addmachine, allmachines, deletemachines, editmachine } = require('../Controllers/machineController');
const ensureAuthenticated = require('../Middlewares/Auth');

<<<<<<< HEAD
const router = require('express').Router();
=======
import {
  addmachine,
  allmachines,
  deletemachines,
  editmachine,
} from "../Controllers/machineController.js";
>>>>>>> 1c33eca054996dc181fb3b0d593890fc8646934c

router.post('/addmachine', ensureAuthenticated, addmachine)
router.post('/allmachine', ensureAuthenticated, allmachines)
router.delete('/deletemachine', ensureAuthenticated, deletemachines)
router.put('/editmachine', ensureAuthenticated, editmachine)

module.exports = router;