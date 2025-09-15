const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')
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
        const date = now.toISOString().slice(0,10) + " " + now.toISOString().slice(11,16);
        const signupTime = date;
        const userModel = new UserModel({name, email, phoneNo, password, company, department, designation, manager, signupTime}) ;
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
          
        const email1 = {
            message: {
                subject: "Approval request",
                body: {
                    contentType: "Text",
                    content: `Dear ${name}\n\nThank you for signing up on MI Profile Generator\n Your request is currently under review. This process typically may take up to 24 hours. \n If you have any questions, feel free to contact us at ${process.env.USER_EMAIL}.\n\nThanks and regards,\nIT Team\nMother India Forming. \n\n************************************************************* The information contained in this message is intended only for use of the individual(s) named above and may contain confidential, proprietary, or legally privileged information. No confidentiality or privilege is waived or lost by any mistransmission. If you are not the intended recipient of this message you are hereby notified that you must not use, disseminate, copy it in any form or take any action in reliance of it. If you have received this message in error, please delete it and any copies of it and notify the sender immediately. ************************************************************`
                },
                toRecipients: [
                    { emailAddress: { address: `${email}` } }
                ],
            },
            saveToSentItems: true
        };
        const email2 = {
            message: {
                subject: "Approval request",
                body: {
                    contentType: "Text",
                    content: `A user has attempted to sign up for MI Profile Generator and has requested a status update within the next 24 hours on https://miforming.com/manager_dashboard. Below are their details:\n\nName: ${name}\nEmail: ${email}\nCompany Name: ${company}. \n\nThanks and regards,\nIT Team\nMother India Forming. \n\n************************************************************* The information contained in this message is intended only for use of the individual(s) named above and may contain confidential, proprietary, or legally privileged information. No confidentiality or privilege is waived or lost by any mistransmission. If you are not the intended recipient of this message you are hereby notified that you must not use, disseminate, copy it in any form or take any action in reliance of it. If you have received this message in error, please delete it and any copies of it and notify the sender immediately. ************************************************************`
                },
                toRecipients: [
                    { emailAddress: { address: `${process.env.USER_EMAIL}` } }
                ],
                ccRecipients: [
                    { emailAddress: { address: `${process.env.Email_CC1}` } },
                    { emailAddress: { address: `${process.env.Email_CC2}` } }
                ]
            },
            saveToSentItems: true
        };
        // const email3 = {
        //     message: {
        //         subject: "Approval request",
        //         body: {
        //             contentType: "Text",
        //             content: `Dear ${name}\n\nThank you for signing up for MI Profile Generator.\nWe are pleased to inform you that your login request has been approved. You can now access your account on https://miforming.com/login.\nIf you have any questions or need any assistance, please feel free to contact us at ${process.env.USER_EMAIL}. \n\nThanks and regards,\nIT Team\nMother India Forming. \n\n************************************************************* The information contained in this message is intended only for use of the individual(s) named above and may contain confidential, proprietary, or legally privileged information. No confidentiality or privilege is waived or lost by any mistransmission. If you are not the intended recipient of this message you are hereby notified that you must not use, disseminate, copy it in any form or take any action in reliance of it. If you have received this message in error, please delete it and any copies of it and notify the sender immediately. ************************************************************`
        //         },
        //         toRecipients: [
        //             { emailAddress: { address: `${email}` } }
        //         ]
        //     },
        //     saveToSentItems: true
        // };
        console.log(email1)
        const response1 = await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email1);
        const response2 = await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email2);

        res.status(201)
        .json({
            message: "You can signin after approvel",
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
       const date = now.toISOString().slice(0,10) + " " + now.toISOString().slice(11,16);
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
