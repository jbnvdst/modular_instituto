import { createContext, useState, useEffect, useContext } from "react";

// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí podrías guardar el user ID, role, etc.
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    console.log("Login attempt with email:", VITE_API_BASE_URL);
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
    setUser({ id: payload.id, role: payload.role, name: payload.name });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
