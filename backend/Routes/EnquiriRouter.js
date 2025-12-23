const { addenquirie, allenquiries, deleteenquirie, editenquirie } = require('../Controllers/enquiriesController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();
router.post('/addenquirie', ensureAuthenticated, addenquirie);
router.post('/allenquiries',ensureAuthenticated, allenquiries);
router.delete('/deleteenquirie',ensureAuthenticated, deleteenquirie)
router.put('/editenquirie',ensureAuthenticated, editenquirie)
module.exports = router;
