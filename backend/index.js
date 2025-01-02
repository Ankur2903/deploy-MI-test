const express = require( 'express' );
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter');
const User = require('./Models/User');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('./Middlewares/Auth');
var nodemailer = require('nodemailer')

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
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.email}`,
        pass: `${process.env.password}`
      },
    })

    console.log(process.env.email)
     console.log(process.env.password)
    
    
    var mailOptions = {
      from: `${process.env.email}`,
      to: `${email}`,
      subject: "Reset your Password",
      text: `https://deploy-mi-test-ui.vercel.app/reset-password/${user._id}/${token}`,
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) console.log(error);
      else  return res.send({success: true, message: "Link send to mail"})
    });
})

app.get("/data",ensureAuthenticated,async (req, res) => {
    try { 
      const Users = await User.find();//{ status: "pending" }
      const user = await User.findOne({email: req.user.email})
      const permission = user.manager;
      if(permission === false) res.json(permission);
      else return res.json(Users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

app.put("/update-status/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL
  const { status } = req.body; // Get the new status from the request body
  try {
     // Find the user by ID and update the status
     const user = await User.findById(userId);
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     user.status = (user.status === 'approved') ?  'rejected' : 'approved';
     const updatedUser = await user.save();
     
    res.json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL
    const deleteID = await User.findByIdAndDelete(userId);
    if (!deleteID) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User remove successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error delete user status", error });
  }
})

app.put("/change-type/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL
  try {
    // Find the user by ID and update the status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.manager = !user.manager;
    const updatedUser = await user.save();
    
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

