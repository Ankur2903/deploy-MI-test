const mongoose = require( 'mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    materialNo: { type: String, required: true },
    materialName: { type: String, required: true },
    grade: { type: String, required: true },
    ysMin: { type: Number, required: true },
    ysMax: { type: Number, required: true },
    utsMin: { type: Number, required: true },
    utsMax: { type: Number, required: true },
    elMin: { type: Number, required: true },
    elMax: { type: Number, required: true },
    c: { type: Number, required: true },
    mn: { type: Number, required: true },
    s: { type: Number, required: true },
    p: { type: Number, required: true },
    si: { type: Number, required: true },
    others: { type: Number, required: true },
    cE: { type: Number, required: true },
    zincCoating: { type: Boolean, default: false },
    zincCoatingMin: { type: Number, required: false },
    zincCoatingMax: { type: Number, required: false }
});


const MaterialModel = mongoose.model('materials' , materialSchema);
module.exports =  MaterialModel;