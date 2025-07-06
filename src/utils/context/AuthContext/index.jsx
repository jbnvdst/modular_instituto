import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí podrías guardar el user ID, role, etc.
  const [token, setToken] = useState(null);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);

  const login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      window.location.href = "/";
    }
    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }
    const data = await response.json();
    // Guarda el token
    setToken(data.token);
    localStorage.setItem("token", data.token);
    // Decodifica el token para obtener el usuario
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    setUser({ id: payload.id, role: payload.role, name: payload.name, profilePicture: payload.profilePicture });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/task-template/${user.id}`);
      // console.log("Response:", response);
      if (response.status === 200) {
        setTaskTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching task templates:", error);
    }
  };

  const fetchRecurringTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recurring-tasks/${user.id}`);
      if (response.status === 200) {
        setRecurringTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching recurring tasks:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      setUser({ id: payload.id, role: payload.role, name: payload.name });
      // console.log(payload);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // console.log("User:", user);
    if (!user) return;
    // console.log("Fetching templates and recurring tasks for user:", user.id);
    fetchTemplates();
    fetchRecurringTasks();
  }, [user]);

  const getDate = (dateString) => {
    const inputDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - inputDate;
    

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const thirtyDays = 30 * oneDay;

    if (diffMs < oneDay) {
      const hours = Math.floor(diffMs / oneHour);
      const minutes = Math.floor((diffMs % oneHour) / oneMinute);

      if (hours > 0 && minutes > 0) {
        return `hace ${hours} h ${minutes} m`;
      } else if (hours > 0) {
        return `hace ${hours} h ${hours > 1 ? 's' : ''}`;
      } else {
        return `hace ${minutes} m`;
      }
    } else if (diffMs < thirtyDays) {
      const days = Math.floor(diffMs / oneDay);
      return `hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      // Mostrar fecha en formato dd/mm/yyyy
      const day = inputDate.getDate().toString().padStart(2, '0');
      const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
      const year = inputDate.getFullYear();
      return `el ${day}/${month}/${year}`;
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getDate, taskTemplates, fetchTemplates, recurringTasks, fetchRecurringTasks }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
