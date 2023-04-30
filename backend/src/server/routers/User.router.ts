import { Router } from "express"
import {
	deleteUserAccount,
	signUpController,
	loginController,
	updateUserController,
	getUserScoreController,
	toggleColorUserController,
} from "../controllers/User.controller"

const userRouter = Router()

userRouter.post("/api/user/signUp", signUpController)
userRouter.delete("/api/user/delete/:token", deleteUserAccount)
userRouter.post("/api/user/login", loginController)
userRouter.patch("/api/user/update", updateUserController)
userRouter.patch("/api/user/toggleColor/:token", toggleColorUserController)
userRouter.get("/api/user/getScore/:token", getUserScoreController)

export default userRouter
