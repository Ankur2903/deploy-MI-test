const mongoose = require( 'mongoose');
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
    email : { type: String, required: true },
    profileName: { type: String, required: true },
    profileDescription: { type: String, required: false },
    profileReferenceNo: { type: String, required: false },
    shapes: { type: mongoose.Schema.Types.Mixed, required: true },
    thickness: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    time : { type: String, required: true },
});


const DrawingModel = mongoose.model('drawings' , drawingSchema);
module.exports =  DrawingModel;