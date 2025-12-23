const { addenquirie, allenquiries, deleteenquirie, editenquirie } = require('../Controllers/enquiriesController');
const ensureAuthenticated = require('../Middlewares/Auth');

<<<<<<< HEAD
const router = require('express').Router();
router.post('/addenquirie', ensureAuthenticated, addenquirie);
router.post('/allenquiries',ensureAuthenticated, allenquiries);
router.delete('/deleteenquirie',ensureAuthenticated, deleteenquirie)
router.put('/editenquirie',ensureAuthenticated, editenquirie)
=======
import {
  addenquirie,
  allenquiries,
  deleteenquirie,
  editenquirie,
} from "../Controllers/enquiriesController.js";
>>>>>>> 1c33eca054996dc181fb3b0d593890fc8646934c

module.exports = router;