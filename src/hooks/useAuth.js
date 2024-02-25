import api from '../utils/api'

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
  const [authenticated, setAutenticated] = useState(false)
  const {setFlashMessage} = useFlashMessage()
  
  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAutenticated(true)
    }

  }, [])

  async function register(user) {

    let msgText = 'Cadastro realizado com sucesso!'
    let msgType = 'success'
    
    try {
      const data = await api.post('/users/register', user).then((response) => {
        return response.data
      })

      await authUser(data)
    } catch (error) {
      msgText = error.response.data.message
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)

  }

  async function authUser(data) {
    setAutenticated(true)   
    localStorage.setItem('token', JSON.stringify(data.token))

    navigate('/');
  }

  return {authenticated, register}

}