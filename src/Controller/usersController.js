const UserModel=require("../Model/userModel");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken")


// registation
const regiController=async (req,res)=>{
    try {
        const hashPassword= await bcrypt.hash(req.body.password,10);
        const user= new UserModel({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:hashPassword,
            photo:req.body.photo,
        })
        await user.save();
        res.status(200).json({
            massege:"data insert was successfull!"
        });
        
    } catch (error) {
        res.status(500).json({
            error:"Internal server error"
        })
        
    }
    


}

// login 
const loginController=async (req,res)=>{
    try {
        const user= await UserModel.find({
            email:req.body.email,
        })
        
        if(user && user.length>0){
            const isValidPassword = await bcrypt.compare(req.body.password,user[0].password)  //return true or false
            
            if(isValidPassword){
                // generate token
                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id,
                },process.env.JWT_TOKEN,{
                    expiresIn:"2h",
                });
                console.log(token);
                res.status(200).json({
                    "access_token":token,
                    message:"Login successful!"
                })
    
            }else{
                res.status(401).json({
                    error:"Authentication Failed !"
                })
    
            }
        }else{
            res.status(401).json({
                error:"Authentication Failed !"
            })
        }
        
    } catch (error) {
        res.status(401).json({
            error:"Authentication Failed !"
        })
        
    }
}

// profile update
const updateProfile= (req,res)=>{
    const email=req.email;
    const reqBody=req.body;
    UserModel.updateOne({email:email},reqBody,
    (error)=>{
        if(error){
            res.status(500).json({error:"there was an server side error"})
        }else{
            res.status(200).json({massege:"data was successfully updated"})
        }
    }
    )
 

}


module.exports={regiController,loginController,updateProfile};