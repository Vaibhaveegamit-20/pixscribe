import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/AppContext'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_5)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  
  const {generateImage} = useContext(AppContext)

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    setLoading(true)

    if(input){
      const image = await generateImage(input)
      if(image){
        setIsImageLoaded(true)
        setImage(image)
      }
    }
    setLoading(false)
  }

  return (
    <motion.form 
    initial={{opacity:0.2, y: 100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    onSubmit={onSubmitHandler} 
    className='flex flex-col min-h-[90vh] justify-center items-center'>
    <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10 dark:text-gray-100">
    <span className='text-purple-700'>Dream</span> it. {` `}
    <span className='text-purple-700'>Describe</span> it. {` `}
    <span className='text-purple-700'>Generate</span> it.
  </h1>

    <div>
      <div className='relative'>
        <img src={image} alt="" className='max-w-sm rounded'/>
        <span className={`absolute bottom-0 left-0 h-1 bg-purple-500 ${loading ? 'w-full transition-all duration - [10s]' : 'w-0'}`}/>
      </div>
      <p className={!loading ? 'hidden' : ''}>Loading....</p>
    </div>

    {/* if Image is not loaded or is to be generated */}
    {!isImageLoaded && 
    <div className='flex w-full max-w-xl bg-purple-300/30 dark:bg-white text-white text-sm p-0.5 mt-10 rounded-full dark:ring-white/10'>
      <input 
      onChange={e => setInput(e.target.value)} 
      value={input}
      type="text" 
      placeholder='Describe what you want to generate' 
      className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-purple-500 text-purple-500'/>
      <button type='submit'className='bg-purple-700 px-10 sm:px-16 py-3 rounded-full'>
        Generate</button>
    </div>
    }

    {/* After the image is generated then display two options */}
    {isImageLoaded && 
    <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      <p onClick={()=>{setIsImageLoaded(false)}}
      className='bg-transparent border border-purple-700 text-purple-700 px-8 py-3 rounded-full cursor-pointer dark:text-white'>Generate Another</p>
      <a href={image} download className='bg-purple-700 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>
    }
    </motion.form>
  )
}

export default Result
