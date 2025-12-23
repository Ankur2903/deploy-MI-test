import dotenv from "dotenv";
import cloudinary from "cloudinary";

import DrawingModel from "../Models/Drawing.js";
import UserModel from "../Models/User.js";

dotenv.config();

/* =======================
   Cloudinary config
======================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* =======================
   Get all drawings
======================= */
const allDrawings = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const drawings = await DrawingModel.find({ email: req.user.email });
    return res.json(drawings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in drawingController >> allDrawings",
      success: false,
    });
  }
};

/* =======================
   Add drawing
======================= */
const addDrawing = async (req, res) => {
  try {
    const {
      profileName,
      profileDescription,
      profileReferenceNo,
      shapes,
      thickness,
      image,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const drawings = await DrawingModel.find({ email: req.user.email });
    if (user.manager === "User" && drawings.length >= 3) {
      return res.status(403).json({
        message: "You can add maximum 3 drawings",
        success: false,
      });
    }

    let now = new Date();
    now.setMinutes(now.getMinutes() + 330); // UTC → IST
    const time =
      now.toISOString().slice(0, 10) +
      " " +
      now.toISOString().slice(11, 16);

    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "MI-Profiles",
      resource_type: "image",
      type: "private",
      overwrite: true,
    });

    const drawingModel = new DrawingModel({
      email: req.user.email,
      profileName,
      profileDescription,
      profileReferenceNo,
      shapes,
      thickness,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      time,
    });

    await drawingModel.save();

    return res.status(201).json({
      message: "Drawing added successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in drawingController >> addDrawing",
      success: false,
    });
  }
};

/* =======================
   Delete drawing
======================= */
const deleteDrawing = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const drawing = await DrawingModel.findById(id);
    if (!drawing || drawing.email !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (drawing.publicId) {
      await cloudinary.v2.uploader.destroy(drawing.publicId, {
        type: "private",
        resource_type: "image",
      });
    }

    await DrawingModel.findByIdAndDelete(id);

    return res.json({
      message: "Drawing(s) removed successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in drawingController >> deleteDrawing",
      success: false,
    });
  }
};

/* =======================
   Edit drawing
======================= */
const editDrawing = async (req, res) => {
  try {
    const {
      id,
      profileName,
      profileDescription,
      profileReferenceNo,
      shapes,
      thickness,
      image,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const drawing = await DrawingModel.findById(id);
    if (!drawing || drawing.email !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (drawing.publicId) {
      await cloudinary.v2.uploader.destroy(drawing.publicId, {
        type: "private",
        resource_type: "image",
      });
    }

    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "MI-Profiles",
      resource_type: "image",
      type: "private",
      overwrite: true,
    });

    drawing.profileName = profileName;
    drawing.profileDescription = profileDescription;
    drawing.profileReferenceNo = profileReferenceNo;
    drawing.shapes = shapes;
    drawing.thickness = thickness;
    drawing.imageUrl = result.secure_url;
    drawing.publicId = result.public_id;

    await drawing.save();

    return res.json({
      message: "Drawing updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in drawingController >> editDrawing",
      success: false,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export { addDrawing, allDrawings, deleteDrawing, editDrawing };
