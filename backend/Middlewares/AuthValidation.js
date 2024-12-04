const Joi = require('joi');
// Middleware to verify JWT and check email
const signupvalidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        company: Joi.string().required(),
        department: Joi.optional(),
        designation: Joi.optional(),
        manager: Joi.optional(),
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request",error })
    }
    next();
}

const loginvalidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const {error} = schema.validate(req. body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request",error })
    }
    next();
}

console.log("AuthValidation is working...")

module.exports = {
    signupvalidation,
    loginvalidation,
}
