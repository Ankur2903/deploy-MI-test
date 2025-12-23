import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../Models/User.js";

import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";

dotenv.config();

/* =======================
   Microsoft Graph setup
======================= */
const credential = new ClientSecretCredential(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

const client = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken(
        "https://graph.microsoft.com/.default"
      );
      return tokenResponse.token;
    },
  },
});

/* =======================
   SIGNUP
======================= */
const signup = async (req, res) => {
  try {
    let {
      name,
      email,
      phoneNo,
      password,
      company,
      department,
      designation,
      manager,
    } = req.body;

    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist",
        success: false,
      });
    }

    let now = new Date();
    now.setMinutes(now.getMinutes() + 330); // UTC → IST
    const date =
      now.toISOString().slice(0, 10) +
      " " +
      now.toISOString().slice(11, 16);

    const signupTime = date;

    const userModel = new UserModel({
      name,
      email,
      phoneNo,
      password,
      company,
      department,
      designation,
      manager,
      signupTime,
    });

    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    /* ---- Email payloads (kept commented as in your code) ---- */
    const email1 = {
      message: {
        subject: "Approval request",
        body: {
          contentType: "Text",
          content: `Dear ${name}

Thank you for signing up on MI Profile Generator.
Your account is currently under review. We will notify you once it is approved.

If you have any questions, contact ${process.env.USER_EMAIL}.`,
        },
        toRecipients: [{ emailAddress: { address: email } }],
      },
      saveToSentItems: true,
    };

    const email2 = {
      message: {
        subject: "Approval request",
        body: {
          contentType: "Text",
          content: `A user has attempted to sign up.

Name: ${name}
Email: ${email}
Company: ${company}`,
        },
        toRecipients: [
          { emailAddress: { address: process.env.USER_EMAIL } },
        ],
        ccRecipients: [
          { emailAddress: { address: process.env.Email_CC1 } },
          { emailAddress: { address: process.env.Email_CC2 } },
        ],
      },
      saveToSentItems: true,
    };

    // await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email1);
    // await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email2);

    return res.status(201).json({
      message: "You can signup after approval",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error in AuthController >> signup",
      success: false,
    });
  }
};

/* =======================
   LOGIN
======================= */
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Auth failed email or password is wrong",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: "Auth failed email or password is wrong",
        success: false,
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "You can Login after Approval",
        success: false,
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message: "You can't login, your request is rejected",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    let now = new Date();
    now.setMinutes(now.getMinutes() + 330);
    const date =
      now.toISOString().slice(0, 10) +
      " " +
      now.toISOString().slice(11, 16);

    user.lastactivity = date;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
      role: user.manager,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export { signup, login };
