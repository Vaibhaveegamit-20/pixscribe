import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "framer-motion"
import axios from 'axios'
import { toast } from 'react-toastify'


const ResetPwd = () => {

  const {backendUrl, setShowLogin, setShowResetPwd} = useContext(AppContext)
  axios.defaults.withCredentials = true

  const [email, setEmail] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1].focus();
      }
    }

  const handleKeyDown = (e, index) => {
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index - 1].focus();
      }
    }

  const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index)=>{
        if(inputRefs.current[index]){
          if(inputRefs.current[index]){
            inputRefs.current[index].value = char;
          }
        }
      })
    }

  const onSubmitEmail = async (e) => {
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/user/send-reset-otp', {email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      }catch(error){
        toast.error(error.message)
      }
    }

  const onSubmitOTP = async (e)=>{
      e.preventDefault();
      const otpArray = inputRefs.current.map(e  => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmitted(true)
    }
  
  const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/user/reset-password', {email, otp, newPassword})
        data.success ? toast.success(data.message) : toast.error(data.message)
        
        if (data.success) {
+        // reset local state
+        setEmail('');
+        setNewPassword('');
+        setIsEmailSent(false);
+        setIsOtpSubmitted(false);

+        // close ResetPwd modal and open Login modal
+        setShowResetPwd(false);
+        setShowLogin(true);
        }
      }catch(error){
        toast.error(error.message)
      }
  }

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>

    {!isEmailSent && 
    <motion.form 
        onSubmit={onSubmitEmail} 
        initial={{opacity:0.2, y: 50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='relative bg-white p-10 rounded-xl text-slate-500'>
          <h1 className='text-center text-2xl text-neutral-700 font-medium'>Reset Password</h1>
          <p className='text-sm text-center'>Enter your registered email address</p>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.email_icon} alt="email" />
            <input onChange={e => setEmail(e.target.value)}
            value={email}
            type="email" 
            className='outline-none text-sm' 
            placeholder='Email id' required/>
        </div>

        <button className='bg-purple-700 w-full text-white py-2 rounded-full mt-4'>Submit</button>

        <img onClick={()=>setShowResetPwd(false)} src={assets.cross_icon} alt="cross" className='absolute top-5 right-5 cursor-pointer'/>
    </motion.form>
    }

    {!isOtpSubmitted && isEmailSent &&
    <motion.form 
        onSubmit={onSubmitOTP} 
        initial={{opacity:0.2, y: 50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='relative bg-white p-10 rounded-xl text-slate-500'>
          <h1 className='text-center text-2xl text-neutral-700 font-medium'>Reset password OTP</h1>
          <p className='text-sm text-center'>Enter the 6-digit code sent to your email id</p>
          
          <div className='flex justify-between mb-8 gap-3 mt-10' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input type="text" maxLength='1' key={index} required
            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
            ref={e => inputRefs.current[index] = e}
            onInput={(e) => handleInput(e, index)}
            handleKeyDown = {(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className='bg-purple-700 w-full text-white py-2 rounded-full mt-4'>Submit</button>

        <img onClick={()=>setShowResetPwd(false)} src={assets.cross_icon} alt="cross" className='absolute top-5 right-5 cursor-pointer'/>
    </motion.form>
    }

    {isOtpSubmitted && isEmailSent && 
    <motion.form 
        onSubmit={onSubmitNewPassword} 
        initial={{opacity:0.2, y: 50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='relative bg-white p-10 rounded-xl text-slate-500'>
          <h1 className='text-center text-2xl text-neutral-700 font-medium'>Set New Password</h1>
          <p className='text-sm text-center'>Enter the new password below</p>

          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                  <img src={assets.lock_icon} alt="password" />
                  <input onChange={e => setNewPassword(e.target.value)} 
                  value={newPassword} 
                  type="password" 
                  className='outline-none text-sm' 
                  placeholder='New Password' required/>
          </div>

          <button className='bg-purple-700 w-full text-white py-2 rounded-full mt-4'>Submit</button>

          <img onClick={()=>setShowResetPwd(false)} src={assets.cross_icon} alt="cross" className='absolute top-5 right-5 cursor-pointer'/>
                
    </motion.form>
    }

    </div>
  )
}

export default ResetPwd
