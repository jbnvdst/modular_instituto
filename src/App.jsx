import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Semaphores from './pages/Semaphores';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import Areas from './pages/Areas';
import TaskTemplates from './pages/TaskTemplates';
import RecurringTasks from './pages/RecurringTasks';
import DemandForecast from './pages/DemandForecast';
import { AreasProvider } from "./utils/context/AreasContext";
import { useAuth } from './utils/context/AuthContext';

// Wrapper para mantener orden de hooks y mostrar "Cargando..."
function RequireAuth({ loading, user, children }) {
  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }
  return user ? children : <Navigate to="/" replace />;
}

const AppRoutes = () => {
  const { user, loadingAuth, getRoleFromToken } = useAuth();
  const userRole = (getRoleFromToken?.() || '').toLowerCase();
  const isAdmin = ['admin', 'administrador', 'superadmin'].includes(userRole);

  const routes = useRoutes([
    { path: '/', element: <Login /> },
    {
      path: '/home',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <Home />
        </RequireAuth>
      ),
    },
    {
      path: '/profile',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <Profile />
        </RequireAuth>
      ),
    },
    {
      path: '/semaphores',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          {isAdmin ? <Semaphores /> : <Navigate to="/home" replace />}
        </RequireAuth>
      ),
    },
    {
      path: '/admin',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          {isAdmin ? <Admin /> : <Navigate to="/home" replace />}
        </RequireAuth>
      ),
    },
    {
      path: '/notification',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <Notifications />
        </RequireAuth>
      ),
    },
    {
      path: '/areas',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <Areas />
        </RequireAuth>
      ),
    },
    {
      path: '/areas/:id',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <Areas />
        </RequireAuth>
      ),
    },
    {
      path: '/tasktemplates',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <TaskTemplates />
        </RequireAuth>
      ),
    },
    {
      path: '/recurringtasks',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <RecurringTasks />
        </RequireAuth>
      ),
    },
    {
      path: '/demand-forecast',
      element: (
        <RequireAuth loading={loadingAuth} user={user}>
          <DemandForecast />
        </RequireAuth>
      ),
    },
    { path: '*', element: <Navigate to="/" replace /> },
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

export default App;
