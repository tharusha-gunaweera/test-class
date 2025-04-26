const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    honorifics:{
        type:String,
    },
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
        required:false, 
    },
    grade:{
        type:Number,
        required:false, 
    },
    address:{
        type:String,
        required:false, 
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