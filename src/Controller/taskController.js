const TaskModel=require("../Model/taskModel");
const mongoose = require("mongoose")


// create task 
const createTask= async(req,res)=>{
    try {
        const reqBody=req.body;
        reqBody.email=req.email;
        const task=new TaskModel(reqBody);
        await task.save()
        res.status(200).json({
            massege:"task data insert was successfull!"
        });
    } catch (error) {
        res.status(500).json({
            error:"Internal server error"
        })
        
    }
    
    
}
// update Task 
const updateTask=async (req,res)=>{
    try {
        await TaskModel.updateOne({
            _id:req.params.id
        },{
           $set:{
            status:req.params.status,
           } 
        })
        res.status(200).json({
            massege:"update succsseful!"
        })
        
    } catch (error) {
        res.status(500).json({
            error:"there was server side error!"
        })
        
    }

}
// delete Task 
const deleteTask=async (req,res)=>{
    try {
        await TaskModel.deleteOne({
            _id:req.params.id
        })
        res.status(200).json({
            massege:"Delete successful!"
        })
        
    } catch (error) {
        res.status(500).json({
            error:"there was an server side error!"
        })
        
    }

}
const getTaskByStatus= (req,res)=>{
    const status=req.params.id;
    const email=req.email;
    console.log(status);
    console.log(email);
         TaskModel.aggregate([
            {
                $match:{
                    status:status,
                    email:email,
                }
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    description:1,
                    status:1,
                    date:1
                    // {
                    //     $dateToString:{
                    //         format:"%d-%m-%y",
                    //         datetime:"$date"
                            
                    //     }
                    // }
                }
            }
            
    ],  (error,data)=>{
        if(error){
            res.status(500).json({
                error:"there was an server side error!"
            })
        }else{
            res.status(200).json({
                massege:" successful!",
                data:data
            })
        }
    }
)
}
// const getTaskCountByStatus= (req,res)=>{
//          TaskModel.find({
//             email:req.email,
//         })
//         .select({
//             status:1,
//         }).count()
//         .exec((error,data)=>{
//             if(error){
//                 res.status(500).json({
//                     error:"there was an server side error!"
//                 })
//             }else{
//                 res.status(200).json({
//                     massege:" successful!",
//                     result:data
//                 })
//             }
//         })  

// }
const getTaskCountByStatus= (req,res)=>{
        const email=req.email;
        console.log(email);
         TaskModel.aggregate([
            {$match:{email:email}},
            {$group:{_id:"$status",sum:{$count:{}}}}
    ],(error,data)=>{
        if(error){
            res.status(500).json({
                error:"there was an server side error!"
            })
        }else{
            res.status(200).json({
                massege:" successful!",
                data:data
            })
        }  
}
  )
} 

module.exports={createTask,updateTask,deleteTask,getTaskByStatus,getTaskCountByStatus};