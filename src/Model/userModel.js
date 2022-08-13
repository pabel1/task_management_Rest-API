const mongoose = require("mongoose");
const userModel=mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    // photo:{
    //     type:String,
    //     required:true,
    // },
    date:{
        type:Date,
        default:Date.now()
    },
    __v:false,

});

const UserModel= mongoose.model("User",userModel);

module.exports=UserModel;