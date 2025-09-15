const express = require( 'express' );
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter');
const User = require('./Models/User');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('./Middlewares/Auth');
const { Client } = require("@microsoft/microsoft-graph-client");
const { ClientSecretCredential } = require("@azure/identity");

const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

const client = Client.initWithMiddleware({ authProvider: { getAccessToken: async () => {
    const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
    return tokenResponse.token;
}}});

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(cors())
app.use(express.json());

app.get('/ping',(req, res) => {
    res.send('PONG') ;
})

app.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the token's hash matches the user's current password hash
    if (decoded.hash !== user.password) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
});



app.post("/forgot-password", async(req, res)=>{
  const {email} = req.body;
  const user = await User.findOne({ email });
      if (!user) {
          return res.status(403)
          .json({ message: 'User not existed please signup first' , success: false}) ;
      }
    const token = jwt.sign({email: user.email, id: user._id,  hash: user.password }, process.env.JWT_SECRET, { expiresIn: '15m'})
    const email1 = {
      message: {
          subject: "Reset your Password",
          body: {
              contentType: "Text",
              content: `https://deploy-mi-test-ui.vercel.app/reset-password/${user._id}/${token}`
          },
          toRecipients: [
              { emailAddress: { address: `${email}` } }
          ],
      },
      saveToSentItems: true
  };
  const response1 = await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email1);
})

app.get("/data",ensureAuthenticated,async (req, res) => {
    try { 
        console.log("wellcome to data);
      const Users = await User.find();//{ status: "pending" }
      const user = await User.findOne({email: req.user.email})
      const permission = user.manager;
      if(permission === false) res.json(permission);
      else return res.json(Users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

app.put("/update-status", async (req, res) => {
   const status = req.body; // Get the new status from the request body
   const selectedUsers = req.body.selectedUsers;
  try {
     // Find the user by ID and update the status
     for(let i=0; i<selectedUsers.length; i++){
      const userId = selectedUsers[i];
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.status = status.status;
      const updatedUser = await user.save();

        let string;
      if(user.status === 'approved'){
        string = `Dear ${user.name}\n\nThank you for signing up for MI Profile Generator.\nWe are pleased to inform you that your login request has been approved. You can now access your account on https://miforming.com/login.\nIf you have any questions or need any assistance, please feel free to contact us at ${process.env.USER_EMAIL}. \n\nThanks and Regards,\nIT-Team\nMother India Forming. \n\n************************************************************* The information contained in this message is intended only for the use of the individual(s) named above and may contain confidential, proprietary, or legally privileged information. No confidentiality or privilege is waived or lost by any mistransmission. If you are not the intended recipient of this message you are hereby notified that you must not use, disseminate, copy it in any form or take any action in reliance of it. If you have received this message in error, please delete it and any copies of it and notify the sender immediately. ************************************************************`
      }
      else if(user.status === 'rejected'){
        string = `Dear ${user.name}\n\nThank you for signing up for MI Profile Generator.\nWe regret to inform you that your login request has not been approved at this time. If you believe this is an error or require further assistance, please contact us at ${process.env.USER_EMAIL}. \n\nThanks and regards,\nIT Team\nMother India Forming. \n\n************************************************************* The information contained in this message is intended only for use of the individual(s) named above and may contain confidential, proprietary, or legally privileged information. No confidentiality or privilege is waived or lost by any mistransmission. If you are not the intended recipient of this message you are hereby notified that you must not use, disseminate, copy it in any form or take any action in reliance of it. If you have received this message in error, please delete it and any copies of it and notify the sender immediately. ************************************************************`
      }
      
      const email1 = {
        message: {
            subject: "Status Update",
            body: {
                contentType: "Text",
                content: `${string}\n\n`
            },
            toRecipients: [
                { emailAddress: { address: `${user.email}` } }
            ],
        },
        saveToSentItems: true
    };
    const response1 = await client.api(`/users/${process.env.USER_EMAIL}/sendMail`).post(email1);
     }     
    res.json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
});
app.delete("/delete", async (req, res) => {
  try {
    const selectedUsers = req.body.selectedUsers;
    for(let i=0; i<selectedUsers.length; i++){
      const userId = selectedUsers[i];
      const deleteID = await User.findByIdAndDelete(userId);
      if (!deleteID) {
        return res.status(404).json({ message: "User not found" });
      }
    }
    res.json({
      message: "User removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error delete user status", error });
  }
})

app.put("/change-type", async (req, res) => {
  const users = req.body.selectedUsers;
  try {
    for(let i=0; i<users.length; i++){
      const userId = users[i];
      // Find the user by ID and update the status
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.manager = !user.manager;
      const updatedUser = await user.save();
    }
    res.json({
        message: "User type updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in updating user Type", error });
  }
});

app.use(bodyParser.json());
app.use('/auth', AuthRouter);

app.listen(PORT, () => {
console.log(`Server is running on ${PORT}`)
})

