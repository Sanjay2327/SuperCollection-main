import express from "express"
import userauth from "../middlewares/userauth.js"
import { getUserData } from "../controllers/userController.js"

const userRouter=express.Router()

userRouter.get('/data',userauth,getUserData)

export default userRouter