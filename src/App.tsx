import './App.css'
import styled from 'styled-components'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { Login } from './components/auth/login'
import { Home } from './components/home'
import { Verify } from './components/auth/verify'
import { useEffect, useState } from 'react'
import AuthService from './services/AuthService'

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`

type CurrentUser = {
  phoneNumber: string
  iat: number
}

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    AuthService.getCurrentUser(setCurrentUser)
  }, [])

  const handleCurrentUserUpdate = () => {
    AuthService.getCurrentUser(setCurrentUser)
    navigate('/')
  }

  const handleLogout = () => {
    AuthService.logout()
    AuthService.getCurrentUser(setCurrentUser)
    navigate('/')
  }

  const renderHome = (currentUser: CurrentUser | null) =>
    currentUser ? <Home onLogout={handleLogout} /> : <Login />

  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={renderHome(currentUser)}></Route>
        <Route
          path="/verify"
          element={<Verify onSuccessVerify={handleCurrentUserUpdate} />}
        ></Route>
      </Routes>
    </AppContainer>
  )
}

export default App
