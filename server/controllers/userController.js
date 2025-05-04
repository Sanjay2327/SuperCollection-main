import userModel from "../models/usermodel.js";

export const getUserData = async(req,res)=>{
    try{
        
        const {userId}=req.body
        const user =await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:'user not found'})
        }
      return res.json({
            success:true,
            userData:{
                name:user.name,
                isVerified:user.isVerified,

            }
        })
    }
    catch(err){
        return res.json({success:false,message:'hii'})
    }
}