const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            console.log("signup working 1");
            return res.status(409)
            .json({ message: 'User is already exist, you can login' , success: false } ) ;
        }
        const userModel = new UserModel({name, email, password}) ;
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
        .json({
            message: "Signup successfully ",
            success: true
        })
        console.log("signup working 2");
    } catch (err){
        console.log("signup working 3");
        res.status(500)
        .json({
            message: "Internal server error in signup AuthController",
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403)
            .json({ message: 'Auth failed email or password is wrong' , success: false } ) ;
        }
       const isPassEqual = await bcrypt.compare(password, user.password)
       if(!isPassEqual){
            return res.status(403)
            .json({ message: 'Auth failed email or password is wrong' , success: false } ) ;
       }
       const jwtToke = jwt.sign(
        { email: user.email, _id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
       )
        res.status(200)
        .json({
            message: "Signup successfully ",
            success: true,
            jwtToke,
            email,
            name: user.name
        })
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error",
            success: false
        })
    }
}



console.log("AuthController is working...")
module.exports = {
    signup,login
}
