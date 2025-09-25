import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js"
import transporter from '../config/nodemailer.js';
import { PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const registerUser = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    //added
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //Sending Welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Pixscribe',
      text: `Welcome to pixscibe website. Your account has been created with email id: ${email}`
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, token, user: { name: user.name } })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

      res.json({ success: true, token, user: { name: user.name } })

    } else {
      return res.json({ success: false, message: 'Invalid Credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;

    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Reset Password OTP',
      //text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'OTP sent to your email' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }

}

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' });
    }

    const hasedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hasedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const userCredits = async (req, res) => {
  try {

    const userId = req.userId;

    const user = await userModel.findById(userId)
    res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorpay = async (req, res) => {

  try {

    const userId = req.userId || (req.body && req.body.userId);
    const { planId } = req.body || {};

    const userData = await userModel.findById(userId)

    if (!userId || !planId) {
      return res.json({ success: false, message: 'Mossing Details' })
    }

    let credits, plan, amount, date

    switch (planId) {
      case 'Basic':
        plan = 'Basic'
        credits = 100
        amount = 10
        break;

      case 'Advanced':
        plan = 'Advanced'
        credits = 500
        amount = 50
        break;

      case 'Business':
        plan = 'Business'
        credits = 5000
        amount = 250
        break;

      default:
        return res.json({ success: false, message: 'plan not found' });
    }

    date = Date.now();

    const transactionData = {
      userId, plan, amount, credits, date
    }

    const newTransaction = await transactionModel.create(transactionData)

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    }

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error)
        return res.json({ success: false, message: error })
      }
      res.json({ success: true, order })
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const verifyRazorpay = async (req, res) => {
  try {

    const { razorpay_order_id } = req.body || {}

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      const transactionData = await transactionModel.findById(orderInfo.receipt)
      if (transactionData.payment) {
        return res.json({ success: false, message: 'Payment failed' })
      }

      const userData = await userModel.findById(transactionData.userId)

      const creditBalance = userData.creditBalance + transactionData.credits

      await userModel.findByIdAndUpdate(userData._id, { creditBalance })

      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

      res.json({ success: true, message: 'Credits Added' })
    } else {
      res.json({ success: false, message: 'Payment Failed' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}