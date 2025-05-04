import mongoose, { mongo } from 'mongoose'

const connectDB=async()=>{
    // console.log('hi');
    
    mongoose.connection.on('connected',()=>console.log("db connected"))
    await mongoose.connect(`${process.env.MONGODB_URL}mern-auth`)
}
export default connectDB