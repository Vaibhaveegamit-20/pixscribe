import { useContext } from 'react';
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { IoSunnySharp, IoMoon  } from "react-icons/io5";
import { useTheme } from '../context/themeContext';

const Navbar = () => {

  const {user,setShowLogin, logout, credit} = useContext(AppContext)
  
  const navigate = useNavigate();

  const {theme, toggleTheme} = useTheme();

  return (
    <div className='flex items-center justify-between py-4'>
      <Link to='/'>
        <img 
        src={theme === "light" ? assets.logo : assets.logo_dark}
        alt="pixscribe" 
        className='w-28 sm:w-32 lg:w-40'/>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        {user ? 
        <div className='flex items-center gap-2 sm:gap-3'>
          <button onClick={()=>navigate('/about')} className='flex items-center px-4 sm:px-6 py-1.5 cursor-pointer border-2 rounded-full border-purple-600 hover:scale-105 transition-all duration-700 dark:text-white'>About</button>
          <button 
          onClick={()=>navigate('/buy')} 
          className='flex items-center gap-2 bg-purple-300/30 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 dark:bg-white'>
            <img className='w-5' src={assets.credit_star} alt="star" />
            <p className='text-xs sm:text-sm font-medium text-gray-600 dark:text-purple-700'>Credit left: {credit}</p>
          </button>
          <p className='text-gray-600 max-sm:hidden pl-4 dark:text-neutral-50'>Hi, {user.name}</p>
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-9 drop-shadow' alt="profile" />
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-gray-600 rounded pt-12'>
              <ul className='list-none m-0 p-2 bg-white rounded-md border border-none text-sm'>
                <li onClick={logout} className='flex items-center gap-4 py-1 px-2 cursor-pointer pr-5'>
                  <span>Logout</span>
                  <img className='w-5' src={assets.logout_icon} alt="logout" />
                  </li>
                
              </ul>
            </div>  
          </div>
        </div>
        :
        (<div className='flex items-center gap-2 sm:gap-5'>
          <p onClick={()=>navigate('/about')} className='cursor-pointer dark:text-neutral-50'>About</p>
          <p onClick={()=>navigate('/buy')} className='cursor-pointer dark:text-neutral-50'>Pricing</p>
          <button onClick={()=>setShowLogin(true)} className='bg-purple-700 text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
        </div>
        )} 

        {/* Theme toggle visible in both states */}
       <button
         onClick={toggleTheme}
         aria-label="Toggle theme"
         className='rounded-full p-2 shadow-md shadow-purple-400 cursor-pointer text-gray-600 hover:text-purple-400 transition-all ease-in-out dark:bg-white'
       >
         {theme === "light" ? <IoMoon/> : <IoSunnySharp/>}
       </button>
      </div>
    </div>
  )
}

export default Navbar
