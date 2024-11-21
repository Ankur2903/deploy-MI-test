const { signup, login } = require('../Controllers/AuthController');
const { signupvalidation, loginvalidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

console.log("AuthRouteris working...")

router.post('/login', loginvalidation, login)
router.post('/signup', signupvalidation, signup)
console.log("AuthRouteris working...")
console.log("AuthRouteris working...")

module.exports = router;
