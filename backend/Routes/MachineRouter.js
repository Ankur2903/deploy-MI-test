const { addmachine, allmachines, deletemachines, editmachine } = require('../Controllers/machineController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.post('/addmachine', ensureAuthenticated, addmachine)
router.post('/allmachine', ensureAuthenticated, allmachines)
router.delete('/deletemachine', ensureAuthenticated, deletemachines)
router.put('/editmachine', ensureAuthenticated, editmachine)

module.exports = router;