const { addmaterial, allmaterial, deletematerial, editmaterial } = require('../Controllers/materialController');
const ensureAuthenticated = require('../Middlewares/Auth');

<<<<<<< HEAD
const router = require('express').Router();
=======
import {
  addmaterial,
  allmaterial,
  deletematerial,
  editmaterial,
} from "../Controllers/materialController.js";
>>>>>>> 1c33eca054996dc181fb3b0d593890fc8646934c

router.post('/addmaterial', ensureAuthenticated, addmaterial)
router.post('/allmaterials', ensureAuthenticated, allmaterial)
router.delete('/deletematerial', ensureAuthenticated, deletematerial)
router.put('/editmaterial', ensureAuthenticated, editmaterial)

module.exports = router;