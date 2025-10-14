const MaterialModel = require('../Models/Materials')
const UserModel = require('../Models/User')
require('dotenv').config();

const addmaterial = async (req, res) => {
    try {
        let {email, materialName, grade, ysMin, ysMax, utsMin, utsMax, elMin, elMax, c, mn, s, p, si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax} = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        const count = await MaterialModel.countDocuments() + 1;
        let materialNo = "MIMS";
        const num = Math.log10(count) + 1;
        for(let i = 0;i<3-num;i++) materialNo = materialNo + "0";
        materialNo = materialNo + count.toString();
        const materialModel = new MaterialModel({materialNo, materialName, grade, ysMin, ysMax, utsMin, utsMax, elMin, elMax, c, mn, s, p, si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax}) ;
        await materialModel.save();
        res.status(201)
        .json({
            message: "Material added successfully.",
            success: true
        })
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in materialController>>addmaterial",
            success: false
        })
    }
}


const allmaterial = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        const materials = await MaterialModel.find();
        return res.json(materials);
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in materialController>>allmaterial",
            success: false
        })
    }
}


const deletematerial = async (req, res) => {
    try {
        const selectedMaterials = req.body.selectedMaterials;
        const email = req.body.email;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        for(let i = 0;i<selectedMaterials.length;i++){
            const materialId = selectedMaterials[i];
            const deleteMaterial = await MaterialModel.findByIdAndDelete(materialId);
            if(!deleteMaterial){
                return res.status(404).json({ message: "Material not found" });
            }
        }
        res.json({message: "material(s) removed successfully", success: true});
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in materialController>>deletematerial",
            success: false
        })
    }
}

const editmaterial = async (req, res) => {
    try {
        let {email, selectedMaterials, newMaterialName, newGrade, newYSMin, newYSMax, newUTSMin, newUTSMax, newElMin, newElMax, newC, newMn, newS, newP, newSi, newOthers, newCE, newZincCoating, newZincCoatingMin, newZincCoatingMax } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(403)
        const permission = user.manager;
        if(permission !== "Admin" && permission !== 'true') return res.status(403);
        const material = await MaterialModel.findById(selectedMaterials[0]);
        if (!material) {
            return res.status(409)
            .json({ message: 'material is not exist' , success: false } ) ;
        }
        material.materialName = newMaterialName;
        material.grade = newGrade;
        material.ysMin = newYSMin;
        material.ysMax = newYSMax;
        material.elMin = newElMin;
        material.elMax = newElMax;
        material.utsMin = newUTSMin;
        material.utsMax = newUTSMax;
        material.c = newC;
        material.mn = newMn;
        material.s = newS;
        material.p = newP;
        material.si = newSi;
        material.others = newOthers;
        material.cE = newCE;
        material.zincCoating = newZincCoating;
        material.zincCoatingMin = newZincCoatingMin;
        material.zincCoatingMax = newZincCoatingMax;
        const editedmaterial = await material.save();
        res.json({
        message: "material updated successfully",
        success: true
      });
    } catch (err){
        res.status(500)
        .json({
            message: "Internal server error in materialController>>editmaterial",
            success: false
        })
    }
}


module.exports = {
    addmaterial, allmaterial, deletematerial, editmaterial
}