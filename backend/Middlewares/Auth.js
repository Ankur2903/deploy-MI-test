const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers[ 'authorization' ];
    if (!auth) {
        return res.status(403)
        .json({ message: 'Unauthorized, JWT token is require'})
    }
    const token = auth.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }
    catch (err) {
        return res.status(403)
        .json({ message: 'Unauthorized, JWT token is wrong or expired'})
    }
}

module.exports = ensureAuthenticated;