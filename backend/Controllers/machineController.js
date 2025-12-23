import dotenv from "dotenv";

import MachineModel from "../Models/Machine.js";
import UserModel from "../Models/User.js";

dotenv.config();

/* =======================
   Add machine (Admin only)
======================= */
const addmachine = async (req, res) => {
  try {
    const {
      machineId,
      type,
      usableShaftLength,
      stripWidthMin,
      stripWidthMax,
      thicknessMin,
      thicknessMax,
      boxPerimeter,
      giCoating,
      numberOfStations,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const no = (await MachineModel.countDocuments()) + 1;

    const machineModel = new MachineModel({
      no,
      machineId,
      type,
      usableShaftLength,
      stripWidthMin,
      stripWidthMax,
      thicknessMin,
      thicknessMax,
      boxPerimeter,
      giCoating,
      numberOfStations,
    });

    await machineModel.save();

    return res.status(201).json({
      message: "Machine added successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in machineController >> addmachine",
      success: false,
    });
  }
};

/* =======================
   Get all machines (Admin)
======================= */
const allmachines = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const machines = await MachineModel.find();
    return res.json(machines);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in machineController >> allmachines",
      success: false,
    });
  }
};

/* =======================
   Delete machines (Admin)
======================= */
const deletemachines = async (req, res) => {
  try {
    const { selectedMachines } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    for (const machineId of selectedMachines) {
      const deleted = await MachineModel.findByIdAndDelete(machineId);
      if (!deleted) {
        return res.status(404).json({ message: "Machine not found" });
      }
    }

    return res.json({
      message: "Machine(s) removed successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in machineController >> deletemachines",
      success: false,
    });
  }
};

/* =======================
   Edit machine (Admin)
======================= */
const editmachine = async (req, res) => {
  try {
    const {
      selectedMachines,
      newMachineId,
      newType,
      newUsableShaftLength,
      newStripWidthMin,
      newStripWidthMax,
      newThicknessMin,
      newThicknessMax,
      newBoxPerimeter,
      newGiCoating,
      newNumberOfStations,
    } = req.body;

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (user.manager !== "Admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const machine = await MachineModel.findById(selectedMachines[0]);
    if (!machine) {
      return res.status(409).json({
        message: "Machine does not exist",
        success: false,
      });
    }

    machine.machineId = newMachineId;
    machine.type = newType;
    machine.usableShaftLength = newUsableShaftLength;
    machine.stripWidthMin = newStripWidthMin;
    machine.stripWidthMax = newStripWidthMax;
    machine.thicknessMin = newThicknessMin;
    machine.thicknessMax = newThicknessMax;
    machine.boxPerimeter = newBoxPerimeter;
    machine.giCoating = newGiCoating;
    machine.numberOfStations = newNumberOfStations;

    await machine.save();

    return res.json({
      message: "Machine updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error in machineController >> editmachine",
      success: false,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export { addmachine, allmachines, deletemachines, editmachine };
