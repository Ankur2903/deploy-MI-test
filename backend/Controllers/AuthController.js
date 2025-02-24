const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')
var nodemailer = require('nodemailer')
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.email}`,
      pass: `${process.env.password}`
    },
  })


const signup = async (req, res) => {
    try {
        let { name, email, phoneNo, password, company, department, designation, manager} = req.body;
        email = email.toLowerCase()
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
            .json({ message: 'User is already exist, you can login' , success: false } ) ;
        }

        let now = new Date();
        now.setMinutes(now.getMinutes() + 330); // Convert UTC to IST (UTC+5:30)
        const date = now.toISOString().slice(0,10);
        const signupTime = date;
        const userModel = new UserModel({name, email, phoneNo, password, company, department, designation, manager, signupTime}) ;
        userModel.password = await bcrypt.hash(password, 10);
        console.log(userModel.signupTime)
        await userModel.save();
          
        var mailOptions = {
            from: `${process.env.email}`,
            to: `${process.env.email}`,
            subject: "Approvel request",
            text: `${name} ${email} want asscess for MI Profile Generator \n\nThanks and Regards, \nMother India`,
        }

        var mailOptions1 = {
            from: `${process.env.email}`,
            to: `${email}`,
            subject: "Approvel request",
            text: `Dear ${name} \n\n Thank you for signing up on Mother India \n\n Your account is currently under review. We will notify you once it is approved. This process typically takes 24 hours. \n\n If you have any questions, feel free to contact us at ${process.env.email}. \n\nThanks and Regards, \nMother India`,
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) console.log(error);
            else  return res.send({success: true, message: "message send to mail"})
        });
        transporter.sendMail(mailOptions1, function(error, info){
            if (error) console.log(error);
            else  return res.send({success: true, message: "message send to mail"})
        });
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
       let now = new Date();
       now.setMinutes(now.getMinutes() + 330); // Convert UTC to IST (UTC+5:30)
       const date = now.toISOString().slice(0,10);
       const lastactivity = date;
       user.lastactivity = lastactivity;
       user.save();
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
