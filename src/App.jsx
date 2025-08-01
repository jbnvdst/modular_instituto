import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Semaphores from './pages/Semaphores'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Notifications from './pages/Notifications'
import Areas from './pages/Areas'
import TaskTemplates from './pages/TaskTemplates'
import RecurringTasks from './pages/RecurringTasks'
import { AreasProvider } from "./utils/context/AreasContext";
import { useAuth } from './utils/context/AuthContext';

const AppRoutes = () => { 
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    // puedes poner un spinner bonito aquí
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  let routes = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/home', element: user ? <Home /> : <Navigate to="/" replace /> },
    { path: '/profile', element: user ? <Profile /> : <Navigate to="/" replace /> },
    { path: '/semaphores', element: user ? <Semaphores /> : <Navigate to="/" replace /> },
    { path: '/admin', element: user ? <Admin /> : <Navigate to="/" replace /> },
    { path: '/notification', element: user ? <Notifications /> : <Navigate to="/" replace /> },
    { path: '/areas', element: user ? <Areas /> : <Navigate to="/" replace /> },
    { path: '/areas/:id', element: user ? <Areas /> : <Navigate to="/" replace /> },
    { path: '/tasktemplates', element: user ? <TaskTemplates /> : <Navigate to="/" replace /> },
    { path: '/recurringtasks', element: user ? <RecurringTasks /> : <Navigate to="/" replace /> },
  ]);

  return routes;
};

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
