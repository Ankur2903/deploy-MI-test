const MachineModel = require('../Models/Machine')
const UserModel = require('../Models/User')
require('dotenv').config();

const addmachine = async (req, res) => {
    try {
        let { machineId, type, usableShaftLength, stripWidthMin, stripWidthMax, thicknessMin, thicknessMax, boxPerimeter, giCoating, numberOfStations } = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const no = await MachineModel.countDocuments() + 1;
        const machineModel = new MachineModel({no, machineId, type, usableShaftLength, stripWidthMin, stripWidthMax, thicknessMin, thicknessMax, boxPerimeter, giCoating, numberOfStations}) ;
        await machineModel.save();
        res.status(201)
        .json({
            message: "Machine added successfully.",
            success: true
        })
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in machineController>>addmachine",
            success: false
        })
    }
}


const allmachines = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const machines = await MachineModel.find();
        return res.json(machines);
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in machineController>>allmachine",
            success: false
        })
    }
}


const deletemachines = async (req, res) => {
    try {
        const selectedMachines = req.body.selectedMachines;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        for(let i = 0;i<selectedMachines.length;i++){
            const machineId = selectedMachines[i];
            const deleteMachine = await MachineModel.findByIdAndDelete(machineId);
            if(!deleteMachine){
                return res.status(404).json({ message: "Machine not found" });
            }
        }
        res.json({message: "machine(s) removed successfully", success: true});
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in machineController>>deletemachines",
            success: false
        })
    }
}

const editmachine = async (req, res) => {
    try {
        let { selectedMachines, newMachineId, newType, newUsableShaftLength, newStripWidthMin, newStripWidthMax, newThicknessMin, newThicknessMax, newBoxPerimeter, newGiCoating, newNumberOfStations } = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const machine = await MachineModel.findById(selectedMachines[0]);
        if (!machine) {
            return res.status(409)
            .json({ message: 'machine is not exist' , success: false } ) ;
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

        const editedmachine = await machine.save();
        res.json({
        message: "machine updated successfully",
        success: true
      });
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in machineController>>editmachine",
            success: false
        })
    }
}

module.exports = {
    addmachine, allmachines, deletemachines, editmachine
}