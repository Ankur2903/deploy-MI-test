const DrawingModel = require('../Models/Drawing')
const UserModel = require('../Models/User')
require('dotenv').config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const allDrawings = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } ) ;
        const drawing = await DrawingModel.find({ email: req.user.email });
        return res.json(drawing);
    } catch (err){
        console.log(err);
        res.status(500)
        .json({
            message: "Internal server error in drawingController>>allDrawings",
            success: false
        })
    }
}

const addDrawing = async (req, res) => {
    try {
        let {profileName, profileDescription, profileReferenceNo, shapes, thickness, image} = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } ) ;
        const drawings = await DrawingModel.find({ email: req.user.email });
        if(user.manager === "User" && drawings.length >= 3){
            return res.status(403).json({ message: 'You can add maximum 3 drawings' , success: false } ) ;
        }
        let now = new Date();
        now.setMinutes(now.getMinutes() + 330); // Convert UTC to IST (UTC+5:30)
        const time = now.toISOString().slice(0,10) + " " + now.toISOString().slice(11,16);
        const result = await cloudinary.uploader.upload(image, {
            folder: "MI-Profiles",
            resource_type: "image",
            type: "private",          // private images
            overwrite: true,
        });
        const drawingModel = new DrawingModel({email: req.user.email, profileName, profileDescription, profileReferenceNo, shapes, thickness,imageUrl: result.secure_url, publicId: result.public_id, time});
        await drawingModel.save();
        res.status(201).json({
            message: "Drawing added successfully.",
            success: true
        })
    } catch (err){
        console.log(err)
        res.status(500).json({
            message: "Internal server error in drawingController>>addDrawing",
            success: false
        })
    }
}

const deleteDrawing = async (req, res) => {
    try {
        const id = req.body.id;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } ) ;
        const drawingUser = await DrawingModel.findById(id);
        if (drawingUser.email !== req.user.email) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const deletepublicId = await DrawingModel.findById(id);
        if(deletepublicId.publicId){
            await cloudinary.uploader.destroy(deletepublicId.publicId, {
            type: "private",   // must match upload type
            resource_type: "image",
        });
        }
        const deletedrawing = await DrawingModel.findByIdAndDelete(id);
        if(!deletedrawing){
            return res.status(404).json({ message: "Drawing not found" });
        }
        res.json({message: "Drawing(s) removed successfully", success: true});
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in drawingController>>delete drawing",
            success: false
        })
    }
}

const editDrawing = async (req, res) => {
    try {
        let {id, profileName, profileDescription, profileReferenceNo, shapes, thickness, image} = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } ) ;
        const drawingUser = await DrawingModel.findById(id);
        if (drawingUser.email !== req.user.email) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const drawing = await DrawingModel.findById(id);
        if (!drawing) {
            return res.status(409)
            .json({ message: 'Drawing is not exist' , success: false } ) ;
        }
        if(drawing.publicId){
            await cloudinary.uploader.destroy(drawing.publicId, {
            type: "private",   // must match upload type
            resource_type: "image",
            });
        }
        const result = await cloudinary.uploader.upload(image, {
            folder: "MI-Profiles",
            resource_type: "image",
            type: "private",          // private images
            overwrite: true,
        });

        drawing.profileName = profileName;
        drawing.profileDescription = profileDescription;
        drawing.profileReferenceNo = profileReferenceNo;
        drawing.shapes = shapes;
        drawing.imageUrl = result.secure_url;
        drawing.publicId = result.public_id;
        drawing.thickness = thickness;
        const editDrawing = await drawing.save();
        res.json({
            message: "Drawing updated successfully",
            success: true
        });
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in drawingController>>editDrawing",
            success: false
        })
    }
}

module.exports = {
    addDrawing, allDrawings, deleteDrawing, editDrawing
}