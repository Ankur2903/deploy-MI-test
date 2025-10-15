const EnquirieModel = require('../Models/Enquiries')
const UserModel = require('../Models/User')
require('dotenv').config();

console.log("enquiriescontroller is working");

const allenquiries = async (req, res) => {
    try {
        console.log("1");
        const { email } = req.body;console.log("2");
        const user = await UserModel.findOne({ email });console.log("3");
        if (!user) return res.status(403);console.log("4");
        const permission = user.manager;console.log(EnquirieModel);
        if(permission !== "Admin" && permission !== 'true') return res.status(403);console.log("6");
        const enquirie = await EnquirieModel.find();console.log("7");
        return res.json(enquirie);
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in materialController>>allmaterial",
            success: false
        })
    }
}

const addenquirie = async (req, res) => {
    try {
        
        let {email, customerName, kAMName, profileName, twoD, threeD, machine, tools, fixture, stripWidth, length, type, thickness, boxPerimeter,  click1, click4, shortRadiusBendingRadius, shortRadiusBendingThickness, click5, longRadiusBendingRadius, longRadiusBendingThickness, click2, laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result} = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        const iD = await EnquirieModel.countDocuments() + 1;
        let now = new Date();
        now.setMinutes(now.getMinutes() + 330); // Convert UTC to IST (UTC+5:30)
        const time = now.toISOString().slice(0,10) + " " + now.toISOString().slice(11,16);
        const enquirieModel = new EnquirieModel({email, iD, customerName, kAMName, profileName, time, result, twoD, threeD, machine, tools, fixture, stripWidth, length, type, thickness, boxPerimeter, click1, click4, click5, shortRadiusBendingRadius, shortRadiusBendingThickness, longRadiusBendingRadius, longRadiusBendingThickness, click2, laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason}) ;
        await enquirieModel.save();
        res.status(201)
        .json({
            message: "Enquirie added successfully.",
            success: true
        })
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in materialController>>addenquirie",
            success: false
        })
    }
}

const deleteenquirie = async (req, res) => {
    try {
        
        const selectedEnquiries = req.body.selectedEnquiries;
        const email = req.body.email;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        for(let i = 0;i<selectedEnquiries.length;i++){
            const enquirieId = selectedEnquiries[i];
            const deleteenquirie = await EnquirieModel.findByIdAndDelete(enquirieId);
            if(!deleteenquirie){
                return res.status(404).json({ message: "Enquirie not found" });
            }
        }
        res.json({message: "Enquirie(s) removed successfully", success: true});
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in materialController>>delete enquirie",
            success: false
        })
    }
}

const editenquirie = async (req, res) => {
    try {
        let {email, id, customerName, kAMName, profileName, twoD, threeD, machine, tools, fixture,  click1, click4, shortRadiusBendingRadius, shortRadiusBendingThickness, click5, longRadiusBendingRadius, longRadiusBendingThickness, click2, laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result} = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        const enquirie = await EnquirieModel.findById(id);
        if (!enquirie) {
            return res.status(409)
            .json({ message: 'Enquirie is not exist' , success: false } ) ;
        }
        enquirie.customerName = customerName;
        enquirie.kAMName = kAMName;
        enquirie.profileName = profileName;
        enquirie.twoD = twoD;
        enquirie.threeD = threeD;
        enquirie.machine = machine;
        enquirie.tools = tools;
        enquirie.fixture = fixture;
        enquirie.click1 = click1;
        enquirie.click4 = click4;
        enquirie.shortRadiusBendingRadius = shortRadiusBendingRadius;
        enquirie.shortRadiusBendingThickness = shortRadiusBendingThickness;
        enquirie.click5 = click5;
        enquirie.longRadiusBendingRadius = longRadiusBendingRadius;
        enquirie.longRadiusBendingThickness = longRadiusBendingThickness;
        enquirie.click2 = click2;
        enquirie.laserCuttingLength = laserCuttingLength;
        enquirie.laserCuttingThickness = laserCuttingThickness;
        enquirie.click3 = click3;
        enquirie.powderCoatingLength = powderCoatingLength;
        enquirie.holePunching = holePunching;
        enquirie.holePunchingDetails = holePunchingDetails;
        enquirie.assemblyProcess = assemblyProcess;
        enquirie.assemblyProcessDetails = assemblyProcessDetails;
        enquirie.click6 = click6;
        enquirie.outsourceActivity = outsourceActivity;
        enquirie.material = material;
        enquirie.tolerance = tolerance;
        enquirie.customerSpecReq = customerSpecReq;
        enquirie.packingSpc = packingSpc;
        enquirie.sample = sample;
        enquirie.volumeMonthlyInTon = volumeMonthlyInTon;
        enquirie.volumeYearlyInTon = volumeYearlyInTon;
        enquirie.spare = spare;
        enquirie.reason = reason;
        enquirie.statuttery = statuttery;
        enquirie.unstared = unstared;
        enquirie.unstaredval = unstaredval;
        enquirie.risk = risk;
        enquirie.riskReason = riskReason;
        enquirie.result = result;

        const editenquirie = await enquirie.save();
        res.json({
        message: "enquirie updated successfully",
        success: true
      });
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in enquiriesController>>editenquirie",
            success: false
        })
    }
}

module.exports = {
    addenquirie, allenquiries, deleteenquirie, editenquirie
}
