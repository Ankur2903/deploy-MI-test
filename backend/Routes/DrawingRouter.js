const { addDrawing, allDrawings, deleteDrawing, editDrawing } = require('../Controllers/drawingController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();
router.post('/adddrawing', ensureAuthenticated, addDrawing);
router.post('/alldrawings', ensureAuthenticated, allDrawings);
router.delete('/deletedrawing', ensureAuthenticated, deleteDrawing);
router.put('/editdrawing', ensureAuthenticated, editDrawing);
module.exports = router;

