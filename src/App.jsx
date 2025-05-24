import { useState } from 'react'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Semaphores from './pages/Semaphores'
import Login from './pages/Login'
import { Layout } from './components/Layout'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/profile', element: <Profile /> },
    { path: '/semaphores', element: <Semaphores /> },
    { path : '/login', element: <Login /> },
  ])

  return routes
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App
