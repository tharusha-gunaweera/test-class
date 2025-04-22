const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true, 
    },
    email:{
       type:String,
       required:true,
    },
    school:{
        type:String,
        required:true, 
    },
    grade:{
        type:Number,
        required:true, 
    },
    address:{
        type:String,
        required:true, 
    },
    password:{
        type:String,
        required:true, 
    },
    acclevel:{
        type:Number,
        required:true, 
    }
});

module.exports = mongoose.model(
    "UserModel",
    userSchema
)