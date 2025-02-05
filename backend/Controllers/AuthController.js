const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')

const signup = async (req, res) => {
    try {
        let { name, email, phoneNo, password, company, department, designation, manager} = req.body;
        email = email.toLowerCase()
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
            .json({ message: 'User is already exist, you can login' , success: false } ) ;
        }
        const userModel = new UserModel({name, email, phoneNo, password, company, department, designation, manager}) ;
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
        .json({
            message: "You can signup after approvel",
            success: true
        })
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in AuthController>>signup",
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        let {email, password } = req.body;
        email = email.toLowerCase()
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
       if(user.status === "pending"){
            return res.status(403)
            .json({ message: 'You can Login after Approvel' , success: false } ) ;
       }
       if(user.status === "rejected"){
            return res.status(403)
            .json({ message: "You can't login your requeast is rejected" , success: false } ) ;
       }
       const jwtToken = jwt.sign(
        { email: user.email, _id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
       )
        res.status(200)
        .json({
            message: "Signup successfully ",
            success: true,
            jwtToken,
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
