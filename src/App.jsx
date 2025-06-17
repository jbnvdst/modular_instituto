import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Semaphores from './pages/Semaphores'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Notifications from './pages/Notifications'
import Areas from './pages/Areas'
import { AreasProvider } from "./utils/context/AreasContext";
import { useAuth } from './utils/context/AuthContext';

const AppRoutes = () => { 
  const { user } = useAuth(); 

  let routes = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/home', element: user ? <Home /> : <Navigate to="/" replace /> },
    { path: '/profile', element: user ? <Profile /> : <Navigate to="/" replace /> },
    { path: '/semaphores', element: user ? <Semaphores /> : <Navigate to="/" replace /> },
    { path: '/admin', element: user ? <Admin /> : <Navigate to="/" replace /> },
    { path: '/notification', element: user ? <Notifications /> : <Navigate to="/" replace /> },
    { path: '/areas', element: user ? <Areas /> : <Navigate to="/" replace /> },
    { path: '/areas/:id', element: user ? <Areas /> : <Navigate to="/" replace /> },
    ])

  return routes
}

function App() {
  return (
    <BrowserRouter>
      <AreasProvider>
        <AppRoutes />
      </AreasProvider>
    </BrowserRouter>
  );
}

export default App
