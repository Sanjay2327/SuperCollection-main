import jwt from "jsonwebtoken"

const userauth=async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
        return res.json({success:false,message:'Not Authorized'})
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id)
            req.body.userId=tokenDecode.id
        else
        return res.json({success:false,message:'not authorized'})
    next()
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}
export default userauth