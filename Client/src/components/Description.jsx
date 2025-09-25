import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"

const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2, y: 100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center my-24 p-6 md:px-28'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2 dark:text-gray-100'>Create AI Images</h1>
      <p className='text-gray-500 mb-8 dark:text-gray-400'>Turn your imagination into visuals</p>

      <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
        <img src={assets.sample_img_1} alt="Sample Image" className='w-80 xl:w-96 rounded-lg'/>
        <div>
          <h2 className='text-3xl font-medium max-w-lg mb-4 dark:text-gray-100'>Introducing Pixscribe – Your AI Image Generator</h2>
          <p className='text-gray-600 mb-4 dark:text-gray-300'>Easily turn your ideas into reality with our AI image generator. Whether you’re looking for stunning visuals or unique creative concepts, our tool transforms your text into eye-catching images within seconds. Just describe what you imagine, and watch it instantly come to life.</p>
          <p className='text-gray-600 dark:text-gray-300'>Simply type in a text prompt, and our advanced AI will create high-quality images in moments. From product visuals to character designs and portraits, even concepts that don’t exist yet can be visualized effortlessly. Powered by next-generation AI technology, the creative possibilities are limitless.</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Description
