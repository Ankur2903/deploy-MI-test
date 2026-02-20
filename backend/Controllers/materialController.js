const MaterialModel = require('../Models/Materials')
const UserModel = require('../Models/User')
require('dotenv').config();

const addmaterial = async (req, res) => {
    try {
        let { materialName, grade, material, ysMin, ysMax, utsMin, utsMax, elMin, elMax, density, c, mn, s, p, si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax} = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const count = await MaterialModel.countDocuments() + 1;
        let materialNo = "MIMS";
        const num = Math.log10(count) + 1;
        for(let i = 0;i<3-num;i++) materialNo = materialNo + "0";
        materialNo = materialNo + count.toString();
        const materialModel = new MaterialModel({materialNo, materialName, grade, material, ysMin, ysMax, utsMin, utsMax, elMin, elMax, density, c, mn, s, p, si, others, cE, zincCoating, zincCoatingMin, zincCoatingMax}) ;
        await materialModel.save();
        res.status(201)
        .json({
            message: "Material added successfully.",
            success: true
        })
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in materialController>>addmaterial",
            success: false
        })
    }
}


const allmaterial = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const materials = await MaterialModel.find();
        return res.json(materials);
    } catch (err){
        console.log(err)
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
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        for(let i = 0;i<selectedMaterials.length;i++){
            const materialId = selectedMaterials[i];
            const deleteMaterial = await MaterialModel.findByIdAndDelete(materialId);
            if(!deleteMaterial){
                return res.status(404).json({ message: "Material not found" });
            }
        }
        res.json({message: "material(s) removed successfully", success: true});
    } catch (err){
        console.log(err)
        res.status(500)
        .json({
            message: "Internal server error in materialController>>deletematerial",
            success: false
        })
    }
}

const editmaterial = async (req, res) => {
    try {
        let { selectedMaterials, newMaterialName, newGrade, newMaterial, newYSMin, newYSMax, newUTSMin, newUTSMax, newElMin, newElMax, newDensity, newC, newMn, newS, newP, newSi, newOthers, newCE, newZincCoating, newZincCoatingMin, newZincCoatingMax } = req.body;
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const permission = user.manager;
        if(permission !== "Admin") return res.status(403).json({ message: 'Unauthorized' , success: false } );
        const material = await MaterialModel.findById(selectedMaterials[0]);
        if (!material) {
            return res.status(409)
            .json({ message: 'material is not exist' , success: false } ) ;
        }
        material.materialName = newMaterialName;
        material.grade = newGrade;
        material.material = newMaterial;
        material.ysMin = newYSMin;
        material.ysMax = newYSMax;
        material.elMin = newElMin;
        material.elMax = newElMax;
        material.utsMin = newUTSMin;
        material.utsMax = newUTSMax;
        material.density = newDensity;
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
        console.log(err)
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
