import React, { useEffect, useState } from 'react'
import { createContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export const AppContext = createContext()

const AppContextProvider = (props) => {

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [credit, setCredit] = useState(false)
  const [showResetPwd, setShowResetPwd] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate()

  {/* Load credits after purchase */}
  const loadCreditsData = async () => {
    try{
      const {data} = await axios.get(backendUrl + '/api/user/credits', {headers: {token}})

      if(data.success){
        setCredit(data.credits)
        setUser(data.user)
      }
    }catch(error){
      console.log(error)
      toast.error(error.message)
    }
  }

  {/* Generate Image */}
  const generateImage = async (prompt) => {
    try{
      const {data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {headers: {token}})

      if(data.success){
        loadCreditsData()
        return data.resultImage
      }else{
        toast.error(data.message)
        loadCreditsData() 
        if(data.creditBalance === 0){
          navigate('/buy')
        }
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  {/* Logout */}
  const logout = () => {
    localStorage.removeItem('token');
    setToken('')
    setUser(null)
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if(token) {
      loadCreditsData()
    }
  }, [token])

  const value = {
    user, setUser,
    showLogin, setShowLogin,
    showResetPwd, setShowResetPwd,
    backendUrl, 
    token, setToken, 
    credit, setCredit,
    loadCreditsData, 
    logout,
    generateImage
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider

