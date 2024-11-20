const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();



router.get('/',ensureAuthenticated, (req, res) => {
    console.log('_ _ _ _ loggged in data', req.user);
    res.status(200).json([
        {
            name: "mobile",
            Price: 1000
        },
        {
            name: "tv",
            Price: 10000
        }
    ])
});

console.log("AuthRouteris working...")

module.exports = router;