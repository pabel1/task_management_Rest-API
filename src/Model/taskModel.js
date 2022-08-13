const mongoose = require("mongoose");
const taskModel=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    status:{
        type:String,
        // enum:["new",""]
    },
    date:{
        type:Date,
        default:Date.now
    },
    __v:false,

});

const TaskModel=mongoose.model("Task",taskModel);

module.exports=TaskModel;