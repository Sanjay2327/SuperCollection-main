import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/usermodel.js'
import transporter from '../config/nodemailer.js'

export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password)
        return res.json({success:false,message:'missingggg details'})
    try{
        const existingUser=await userModel.findOne({email})
        if(existingUser)
            return res.json({success:false,message:'user already exist'})
        const hashedPassword=await bcrypt.hash(password,10)
        const user=new userModel({name,email,password:hashedPassword})
        await user.save();
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        // Sending Welcome Mail
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to authentication System",
            text:`Welcome to auth system ur account has been created with mail ${email}`
        }
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.response);
           

        } catch (error) {
            console.error("Error sending email: ", error);
        }
        return res.json({success:true})

    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}
export const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
        return res.json({success:false,message:'email and password are required'})
    try{
        const user=await userModel.findOne({email})
        if(!user)
            return res.json({success:false,message:'invalid email'})
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.json({success:false,message:'invalid password'})
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true,message:'Logged In'})
    }
    catch(err){
        return res.json({success:false,message:err.message})
    }
}
export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true,message:'Logged out'})
    }
    catch(err){
        return res.json({success:false,message:err.message})

    }
}

export const sendVerifyOtp=async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await userModel.findById(userId)
        if(user.isVerified){
            return res.json({success:false,message:'account already verified'})
        }
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp=otp;
        user.verifyOtpExpireAr=Date.now()+24*60*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account verification otp',
            text:`Your otp is ${otp}`,
        }
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:'otp sent '})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}
export const verifyEmail = async(req,res)=>{
   
    
    const {userId,otp}=req.body;
    if(!userId || !otp){
        return res.json({success:false,message:'missing details'})
    }
    try{
            const user=await userModel.findById(userId)
            if(!user){
                return res.json({success:false,message:'user not found'})
            }
            if(user.verifyOtp==='' || user.verifyOtp!==otp){
                return res.json({success:false,message:'incorrect otp'})
            }
            if(user.verifyOtpExpireAr<Date.now()){
                return res.json({success:false,message:'otp was expired'})
            }
            user.isVerified=true;
            user.verifyOtp='';
            user.verifyOtpExpireAr=0
            await user.save();
           return res.json({success:true,message:'email verified succesfully'})

    }
    catch(err){
       return res.json({success:false,message:err.message})
    }
}
//user is authenticated or not
export const isAuthenticated=async(req,res)=>{
    try{
        return res.json({success:true})
    }
    catch(err){
        return res.json({success:false,message:err.message})
     }
}
//send password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    console.log(email);
    
    if(!email)
        return res.json({success:false,message:'missing details'})
    try{
        const user=await userModel.findOne({email})
        if(!user)
            return res.json({success:false,message:'user not found'})
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'reset  otp',
            text:`Your otp is ${otp}`,
        }
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:'otp sent '})
    }
    catch(err){
        return res.json({success:false,message:err.message})
     }
}

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email || !otp || !newPassword)
        return res.json({success:false,message:'email,otp,new password are required'})
    try{
        const user=await userModel.findOne({email})
        if(!user)
            return res.json({success:false,message:'user not found'})
        if(user.resetOtp==='' || user.resetOtp!==otp){
            return res.json({success:false,message:'invalid otp'})
        }
        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false,message:'otp was expired'})
        }
        const hashedPassword=await bcrypt.hash(newPassword,10)
        user.password=hashedPassword;
        user.resetOtp=''
        user.resetOtpExpireAt=0
        await user.save()
        return res.json({success:true,message:'password reset successfully'})
    }
    catch(err){
        return res.json({success:false,message:err.message})
     }
}