const mongoose = require( 'mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: false,
    },
    designation: {
        type: String,
        required: false,
    },
    status: {
        type: String, eum: ["pending", "approved",  "rejected"], default: "pending"
    },
    manager: {
        type: Boolean, default: false,
    }
});

console.log("User is working...")

const UserModel = mongoose.model('users' , UserSchema);
module.exports =  UserModel;
