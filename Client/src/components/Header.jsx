import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const {user, setShowLogin} = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = ()=>{
    if(user){
      navigate('/result')
    }else{
      setShowLogin(true)
    }
  }

  return (
    <motion.div className='flex flex-col justify-center items-center text-center my-20'
    initial = {{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    >
      <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-10 py-3 rounded-full border border-neutral-500'
      initial = {{opacity:0, y:-20}}
      animate ={{opacity:1, y:0}}
      transition={{delay:0.2, duration:0.8}}
      >
        <p className="whitespace-nowrap">AI Text-to-Image Generator</p>
        <img src={assets.star_icon} alt="stars" />
      </motion.div>

      <motion.h1 className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[690px] mx-auto mt-10 text-center dark:text-neutral-50'>Turn your words into <span className='text-purple-700'
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{delay:0.4, duration:2}}
      >images</span> instantly.</motion.h1>

      <motion.p className='text-center max-w-xl mx-auto mt-5 dark:text-neutral-50'
      initial = {{opacity:0, y:20}}
      animate ={{opacity:1, y:0}}
      transition={{delay:0.6, duration:0.8}}
      >From words to art in seconds. Unleash creativity with AI-powered image generation — simple, fast, and magical.</motion.p>

      <motion.button onClick={onClickHandler}
      className='sm:text-lg text-white bg-gradient-to-r from-purple-500 to-indigo-600 
           hover:from-purple-600 hover:to-indigo-700 w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full '
      whileHover={{ scale: 1.05}}
      whileTap={{scale:0.95}}
      initial = {{opacity:0}}
      animate ={{opacity:1}}
      transition={{default: {duration:0.5}, opacity:{delay:0.8, duration:1}}}
      >Generate with AI <img className="h-6" src={assets.star_group} alt="stars" />
      </motion.button>

      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex flex-wrap justify-center mt-16 gap-3"
      >
      {[
        assets.sample_img_1,
        assets.sample_img_2,
        assets.sample_img_3,
        assets.sample_img_4,
        assets.sample_img_5,
        assets.sample_img_6,
      ].map((img, index) => (
        <motion.img
          key={index}
          whileHover={{ scale: 1.05 }}
          className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
          src={img}
          alt={`sample-${index}`}
          width={70}
        />
      ))}
      </motion.div>


      <motion.p 
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{delay:1.2, duration:0.8}}
      className='mt- text-neutral-600 dark:text-neutral-300'>Generated images from prescribe</motion.p>
    </motion.div>
  )
}

export default Header
