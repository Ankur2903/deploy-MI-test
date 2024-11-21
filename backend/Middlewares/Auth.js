const jwt = require('jsonwebtoken');
const { mkcol } = require('../Routes/AuthRouter');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers[ 'authorization' ];
    if (!auth) {
        return res.status(403)
        .json({ message: 'Unauthorized, JWT token is require in auth'})
    }
    try{
        console.log(is working in auth);
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }
    catch (err) {
        return res.status(403)
        .json({ message: 'Unauthorized, JWT token is wrong or expired in auth'})
    }
}

module.exports = ensureAuthenticated;
