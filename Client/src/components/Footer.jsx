import React from 'react'
import { assets } from '../assets/assets'
import { useTheme } from '../context/themeContext';

const Footer = () => {

  const {theme, toggleTheme} = useTheme();

  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>
      <img 
        src={theme === "light" ? assets.logo : assets.logo_dark}
        alt="Pixscribe" 
        width={150}/>

      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 dark:text-neutral-200 dark:border-neutral-100'>Copyright @Vaibhavee | All right reserved.</p>

      <div className='flex gap-2.5 '>
        <img src={assets.facebook_icon} alt="Facebook" width={35}/>
        <img src={assets.twitter_icon} alt="Twitter" width={35}/>
        <img src={assets.instagram_icon} alt="Instagram" width={35}/>
      </div>
    </div>
  )
}

export default Footer
