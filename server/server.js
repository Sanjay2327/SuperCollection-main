import express from "express"
import cors from "cors"
import 'dotenv/config';
import cookieParser from "cookie-parser" 
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import mongoose from "mongoose";
const app=express()

const port= process.env.PORT || 4000
//connectDB()
mongoose.connect("mongodb+srv://kumbhamsnehareddy:sneha@ecommerce.atlooep.mongodb.net/").then(()=>{console.log("Database Connected")}).catch((err)=>{console.log(err)})
const allowedOrigins=['http://localhost:5173']
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedOrigins,credentials:true}))

// API endpoints
app.get('/',(req,res)=>{
    res.send("API Working")
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
})