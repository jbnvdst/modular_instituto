import React, { useState, useEffect } from 'react';
import { Activity, User, Lock, Eye, EyeOff } from 'lucide-react';
import docImage from '../../assets/img/doc.svg'; // Asegúrate de que la ruta sea correcta
import { useAuth } from '../../utils/context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'; // <-- Agrega esto

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate(); // <-- Agrega esto
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user && user.name) {
        localStorage.setItem("userName", user.name);
      }
      navigate('/home'); 
      alert('Login exitoso!');
    } catch {
      alert('Credenciales incorrectas');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Columna Izquierda - Ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden">
        
        {/* Elementos decorativos del fondo */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Contenido principal de la ilustración */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          
          <img src={docImage} alt="Doctor" className="w-90 h-90 object-cover rounded-full" />

          {/* Texto descriptivo */}
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Tecnología Médica
              <span className="block text-teal-200">del Futuro</span>
            </h2>
            <p className="text-lg text-teal-100 leading-relaxed mb-8">
              Plataforma integral para la gestión médica moderna. Seguridad, eficiencia y cuidado del paciente en un solo lugar.
            </p>
            
            {/* Características destacadas */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-teal-100">Expedientes electrónicos seguros</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-teal-100">Telemedicina integrada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-teal-100">Análisis predictivo avanzado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
                <Activity className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Portal Médico
              </h1>
            </div>

            {/* Header del formulario */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600 text-sm">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Campo Usuario */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Usuario"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  >
                    <span className="text-gray-400 cursor-pointer text-xl mr-3">
                      {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/> }
                    </span>
                  </button>
                </div>
              </div>

              {/* Recordar sesión y recuperar contraseña */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">Recordar sesión</span>
                </label>
                <button
                  type="button"
                  className="text-sm cursor-pointer text-teal-600 hover:text-teal-700 transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                ¿Necesitas acceso al sistema?
              </p>
              <button className="text-sm cursor-pointer font-medium text-teal-600 hover:text-teal-700 transition-colors">
                Contacta al administrador del sistema
              </button>
            </div>

            {/* Información de seguridad */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  Sistema protegido con encriptación de extremo a extremo
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <span>Soporte 24/7</span>
                  <span>•</span>
                  <span>HIPAA Compliant</span>
                  <span>•</span>
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;