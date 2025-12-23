import dotenv from "dotenv";

import MaterialModel from "../Models/Materials.js";
import UserModel from "../Models/User.js";

dotenv.config();

/* =======================
   Add material (Admin)
======================= */
const addmaterial = async (req, res) => {
  try {
    const {
      materialName,
      grade,
      ysMin,
      ysMax,
      utsMin,
      utsMax,
      elMin,
      elMax,
      c,
      mn,
      s,
      p,
      si,
      others,
      cE,
      zincCoating,
      zincCoatingMin,
      zincCoatingMax,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const count = (await MaterialModel.countDocuments()) + 1;

    let materialNo = "MIMS";
    const num = Math.floor(Math.log10(count)) + 1;
    for (let i = 0; i < 3 - num; i++) materialNo += "0";
    materialNo += count.toString();

    const materialModel = new MaterialModel({
      materialNo,
      materialName,
      grade,
      ysMin,
      ysMax,
      utsMin,
      utsMax,
      elMin,
      elMax,
      c,
      mn,
      s,
      p,
      si,
      others,
      cE,
      zincCoating,
      zincCoatingMin,
      zincCoatingMax,
    });

    await materialModel.save();

    return res.status(201).json({
      message: "Material added successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in materialController >> addmaterial",
      success: false,
    });
  }
};

/* =======================
   Get all materials
======================= */
const allmaterial = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const materials = await MaterialModel.find();
    return res.json(materials);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in materialController >> allmaterial",
      success: false,
    });
  }
};

/* =======================
   Delete materials (Admin)
======================= */
const deletematerial = async (req, res) => {
  try {
    const { selectedMaterials } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    for (const materialId of selectedMaterials) {
      const deleted = await MaterialModel.findByIdAndDelete(materialId);
      if (!deleted) {
        return res.status(404).json({ message: "Material not found" });
      }
    }

    return res.json({
      message: "Material(s) removed successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in materialController >> deletematerial",
      success: false,
    });
  }
};

/* =======================
   Edit material (Admin)
======================= */
const editmaterial = async (req, res) => {
  try {
    const {
      selectedMaterials,
      newMaterialName,
      newGrade,
      newYSMin,
      newYSMax,
      newUTSMin,
      newUTSMax,
      newElMin,
      newElMax,
      newC,
      newMn,
      newS,
      newP,
      newSi,
      newOthers,
      newCE,
      newZincCoating,
      newZincCoatingMin,
      newZincCoatingMax,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const material = await MaterialModel.findById(selectedMaterials[0]);
    if (!material) {
      return res.status(409).json({
        message: "Material does not exist",
        success: false,
      });
    }

    Object.assign(material, {
      materialName: newMaterialName,
      grade: newGrade,
      ysMin: newYSMin,
      ysMax: newYSMax,
      utsMin: newUTSMin,
      utsMax: newUTSMax,
      elMin: newElMin,
      elMax: newElMax,
      c: newC,
      mn: newMn,
      s: newS,
      p: newP,
      si: newSi,
      others: newOthers,
      cE: newCE,
      zincCoating: newZincCoating,
      zincCoatingMin: newZincCoatingMin,
      zincCoatingMax: newZincCoatingMax,
    });

    await material.save();

    return res.json({
      message: "Material updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in materialController >> editmaterial",
      success: false,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export { addmaterial, allmaterial, deletematerial, editmaterial };
