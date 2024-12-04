const express = require( 'express' );
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter');
const User = require('./Models/User');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('./Middlewares/Auth');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(cors())
app.use(express.json());


app.get('/ping',(req, res) => {
    res.send('PONG') ;
})

app.get("/data",ensureAuthenticated,async (req, res) => {
    try { 
      const Users = await User.find();//{ status: "pending" }
      const ismanager = await User.findOne({email: req.user.email})
      const permission = ismanager.manager;
      res.json({Users,permission});
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

  app.put("/update-status/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL
  const { status } = req.body; // Get the new status from the request body
  
  try {
    // Find the user by ID and update the status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status }, // Update the status field
      { new: true } // Return the updated document
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
});


app.use(bodyParser.json());
;
app.use('/auth', AuthRouter);


app.listen(PORT, () => {
console.log(`Server is running on ${PORT}`)
})



