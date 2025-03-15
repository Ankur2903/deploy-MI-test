const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')
var nodemailer = require('nodemailer')
require('dotenv').config();
const { Client } = require("@microsoft/microsoft-graph-client");
const { ClientSecretCredential } = require("@azure/identity");

const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

const client = Client.initWithMiddleware({ authProvider: { getAccessToken: async () => {
    const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
    return tokenResponse.token;
}}});


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
        await userModel.save();
          
        const email1 = {
            message: {
                subject: "Test Email via Microsoft Graph API",
                body: {
                    contentType: "Text",
                    content: "This is a test email sent using Microsoft Graph API in Node.js."
                },
                toRecipients: [
                    { emailAddress: { address: `${email}` } }
                ],
            },
            saveToSentItems: true
        };
        const response = await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email1);

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

module.exports = {
    signup,login
}
