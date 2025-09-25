import express from 'express'
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, sendResetOtp, resetPassword } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/send-reset-otp', sendResetOtp)
userRouter.post('/reset-password', resetPassword);
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razor', userAuth, paymentRazorpay)
userRouter.post('/verify-razor', userAuth, verifyRazorpay)

export default userRouter