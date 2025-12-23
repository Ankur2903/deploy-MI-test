import dotenv from "dotenv";

import EnquirieModel from "../Models/Enquiries.js";
import UserModel from "../Models/User.js";

dotenv.config();

/* =======================
   Get all enquiries
======================= */
const allenquiries = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const permission = user.manager;
    if (permission === "User") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const enquiries = await EnquirieModel.find();
    return res.json(enquiries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in enquiriesController >> allenquiries",
      success: false,
    });
  }
};

/* =======================
   Add enquiry
======================= */
const addenquirie = async (req, res) => {
  try {
    const {
      customerName,
      customerRefNo,
      kAMName,
      profileName,
      profileNo,
      twoD,
      threeD,
      machine,
      tools,
      fixture,
      stripWidth,
      length,
      type,
      thickness,
      boxPerimeter,
      click1,
      click4,
      shortRadiusBendingRadius,
      click5,
      longRadiusBendingRadius,
      click2,
      laserCuttingLength,
      click3,
      powderCoatingLength,
      holePunching,
      holePunchingDetails,
      assemblyProcess,
      assemblyProcessDetails,
      click6,
      outsourceActivity,
      material,
      materialIndianEquiv,
      tolerance,
      customerSpecReq,
      packingSpc,
      sample,
      volumeMonthlyInTon,
      volumeYearlyInTon,
      spare,
      reason,
      statuttery,
      unstared,
      unstaredval,
      risk,
      riskReason,
      result,
      enquirieDate,
      reviewDate,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const iD = (await EnquirieModel.countDocuments()) + 1;

    let now = new Date();
    now.setMinutes(now.getMinutes() + 330); // UTC → IST
    const time =
      now.toISOString().slice(0, 10) +
      " " +
      now.toISOString().slice(11, 16);

    const enquirieModel = new EnquirieModel({
      email: req.user.email,
      iD,
      customerName,
      customerRefNo,
      kAMName,
      profileName,
      profileNo,
      time,
      result,
      twoD,
      threeD,
      machine,
      tools,
      fixture,
      stripWidth,
      length,
      type,
      thickness,
      boxPerimeter,
      click1,
      click4,
      click5,
      shortRadiusBendingRadius,
      longRadiusBendingRadius,
      click2,
      laserCuttingLength,
      click3,
      powderCoatingLength,
      holePunching,
      holePunchingDetails,
      assemblyProcess,
      assemblyProcessDetails,
      click6,
      outsourceActivity,
      material,
      materialIndianEquiv,
      tolerance,
      customerSpecReq,
      packingSpc,
      sample,
      volumeMonthlyInTon,
      volumeYearlyInTon,
      spare,
      reason,
      statuttery,
      unstared,
      unstaredval,
      risk,
      riskReason,
      enquirieDate,
      reviewDate,
    });

    await enquirieModel.save();

    return res.status(201).json({
      iD: enquirieModel.iD,
      message: "Enquiry added successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in enquiriesController >> addenquirie",
      success: false,
    });
  }
};

/* =======================
   Delete enquiries
======================= */
const deleteenquirie = async (req, res) => {
  try {
    const { selectedEnquiries } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const permission = user.manager;
    if (permission === "User") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    for (const enquirieId of selectedEnquiries) {
      const deleted = await EnquirieModel.findByIdAndDelete(enquirieId);
      if (!deleted) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
    }

    return res.json({
      message: "Enquiry(s) removed successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in enquiriesController >> deleteenquirie",
      success: false,
    });
  }
};

/* =======================
   Edit enquiry
======================= */
const editenquirie = async (req, res) => {
  try {
    const {
      id,
      customerName,
      customerRefNo,
      kAMName,
      profileName,
      profileNo,
      twoD,
      threeD,
      machine,
      tools,
      fixture,
      click1,
      click4,
      shortRadiusBendingRadius,
      click5,
      longRadiusBendingRadius,
      click2,
      laserCuttingLength,
      click3,
      powderCoatingLength,
      holePunching,
      holePunchingDetails,
      assemblyProcess,
      assemblyProcessDetails,
      click6,
      outsourceActivity,
      material,
      materialIndianEquiv,
      tolerance,
      customerSpecReq,
      packingSpc,
      sample,
      volumeMonthlyInTon,
      volumeYearlyInTon,
      spare,
      reason,
      statuttery,
      unstared,
      unstaredval,
      risk,
      riskReason,
      result,
      reviewDate,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const permission = user.manager;
    if (permission === "User") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const enquirie = await EnquirieModel.findById(id);
    if (!enquirie) {
      return res.status(409).json({
        message: "Enquiry does not exist",
        success: false,
      });
    }

    Object.assign(enquirie, {
      customerName,
      customerRefNo,
      kAMName,
      profileName,
      profileNo,
      twoD,
      threeD,
      machine,
      tools,
      fixture,
      click1,
      click4,
      shortRadiusBendingRadius,
      click5,
      longRadiusBendingRadius,
      click2,
      laserCuttingLength,
      click3,
      powderCoatingLength,
      holePunching,
      holePunchingDetails,
      assemblyProcess,
      assemblyProcessDetails,
      click6,
      outsourceActivity,
      material,
      materialIndianEquiv,
      tolerance,
      customerSpecReq,
      packingSpc,
      sample,
      volumeMonthlyInTon,
      volumeYearlyInTon,
      spare,
      reason,
      statuttery,
      unstared,
      unstaredval,
      risk,
      riskReason,
      result,
      reviewDate,
    });

    await enquirie.save();

    return res.json({
      message: "Enquiry updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in enquiriesController >> editenquirie",
      success: false,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export { addenquirie, allenquiries, deleteenquirie, editenquirie };
