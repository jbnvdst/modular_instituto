import { useState } from 'react'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Semaphores from './pages/Semaphores'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Notifications from './pages/Notifications'
import Areas from './pages/Areas'
import { AreasProvider } from "./utils/context/AreasContext";


const AppRoutes = () => { 
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/profile', element: <Profile /> },
    { path: '/semaphores', element: <Semaphores /> },
    { path : '/login', element: <Login /> },
    { path: '/admin', element: <Admin /> },
    { path: '/notification', element: <Notifications /> },
    { path: '/areas', element: <Areas /> },
    ])

  return routes
}

function App() {
  return (
    <AreasProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AreasProvider>
  );
}

export default App
