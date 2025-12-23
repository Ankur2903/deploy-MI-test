const { addmaterial, allmaterial, deletematerial, editmaterial } = require('../Controllers/materialController');
const ensureAuthenticated = require('../Middlewares/Auth');


const router = require('express').Router();

router.post('/addmaterial', ensureAuthenticated, addmaterial)
router.post('/allmaterials', ensureAuthenticated, allmaterial)
router.delete('/deletematerial', ensureAuthenticated, deletematerial)
router.put('/editmaterial', ensureAuthenticated, editmaterial)

module.exports = router;
