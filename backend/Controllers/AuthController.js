const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')

const signup = async (req, res) => {
    try {
        const { name, email, password, company, department, designation} = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            console.log("signup working 1 in login in authcontrolle");
            return res.status(409)
            .json({ message: 'User is already exist, you can login in login in authcontrolle' , success: false } ) ;
        }
        const userModel = new UserModel({name, email, password, company, department, designation}) ;
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
        .json({
            message: "Signup successfully ",
            success: true
        })
        console.log("signup working 2 in login in authcontrolle");
    } catch (err){
        console.log("signup working 3 in login in authcontrolle");
        res.status(0)
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
            console.log("login working 1 in login in authcontrolle");
            return res.status(403)
            .json({ message: 'Auth failed email or password is wrong' , success: false } ) ;
        }
        console.log("login working 2");
       const isPassEqual = await bcrypt.compare(password, user.password)
       if(!isPassEqual){
           console.log("login working 3");
            return res.status(403)
            .json({ message: 'Auth failed email or password is wrong in login in authcontrolle' , success: false } ) ;
       }
        console.log("login working 4");
       const jwtToke = jwt.sign(
        { email: user.email, _id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
       )
        res.status(200)
        .json({
            message: "Login successfully in login in authcontroller",
            success: true,
            jwtToke,
            email,
            name: user.name
        })
    } catch (err){
        console.log("login working 1 in login in authcontrolle");
        res.status(0)
        .json({
            message: "Internal server error in login in authcontroller",
            success: false
        })
    }
}



console.log("AuthController is working...")
module.exports = {
    signup,login
}
