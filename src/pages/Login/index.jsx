import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Activity, User, Lock, Eye, EyeOff } from 'lucide-react';
import { NavLink, useLocation } from "react-router-dom";
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
  const [showRegister, setShowRegister] = useState(false);

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
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture || null,
        }));
      }
      navigate('/home'); 
      // alert('Login exitoso!');
    } catch {
      alert('Credenciales incorrectas');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* Columna Izquierda - Ilustración */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        
        {/* Elementos decorativos del fondo */}
        <div className="absolute top-10 left-10 lg:top-20 lg:left-20 w-32 h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 lg:bottom-20 lg:right-20 w-40 h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Contenido principal de la ilustración */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white">
          
          <img 
            src={docImage} 
            alt="Doctor" 
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover mb-4 lg:mb-0" 
          />

          {/* Texto descriptivo */}
          <div className="text-center max-w-xs sm:max-w-sm lg:max-w-md">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 lg:mb-6 leading-tight">
              Tecnología Médica
              <span className="block text-teal-200">del Futuro</span>
            </h2>
            <p className="text-sm sm:text-xs lg:text-md text-teal-100 leading-relaxed mb-4 lg:mb-8">
              Plataforma integral para la gestión médica moderna. Seguridad, eficiencia y cuidado del paciente en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="w-svw lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 h-svh">
        <div className="w-svw flex justify-center items-center h-svh max-w-sm sm:max-w-md">
          <div className=" bg-white w-[100%] h-[90svh] flex flex-col justify-evenly rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl p-6 sm:p-8">
            
            {/* Logo y título */}
            <div className="text-center mb-3 lg:mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12 bg-teal-600 rounded-xl lg:rounded-2xl mb-1 shadow-lg">
                <Activity className="text-white w-4 h-4 sm:w-7 sm:h-7 lg:w-6 lg:h-6" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-800 mb-2">
                Portal Médico
              </h1>
            </div>

            {/* Formulario Login o Registro */}
            {!showRegister ? (
              <Formik
                initialValues={{ email: '', password: '', remember: false }}
                onSubmit={async (values, { setSubmitting }) => {
                  setIsLoading(true);
                  try {
                    const user = await login(values.email, values.password);
                    if (user) {
                      localStorage.setItem("user", JSON.stringify({
                        name: user.name,
                        email: user.email,
                        profilePicture: user.profilePicture || null,
                      }));
                      navigate('/home');
                    }
                  } catch {
                    alert('Credenciales incorrectas');
                  }
                  setIsLoading(false);
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange }) => (
                  <Form className="space-y-3 sm:space-y-3">

                    {/* Campo Usuario */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                        Usuario
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field
                          id="email"
                          name="email"
                          type="text"
                          className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                          placeholder="Usuario"
                          required
                        />
                      </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                        Contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                          placeholder="Contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                        >
                          <span className="text-gray-400 cursor-pointer">
                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Recordar sesión y recuperar contraseña */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-x-12 sm:space-y-0">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Field
                          type="checkbox"
                          name="remember"
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                        />
                        <span className="text-xs sm:text-xs text-gray-600">Recordar sesión</span>
                      </label>
                      <button
                        type="button"
                        className="text-xs sm:text-xs cursor-pointer text-teal-600 hover:text-teal-700 transition-colors font-medium text-left sm:text-right"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-teal-600 mt-3 cursor-pointer text-white py-1 sm:py-1 px-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Iniciando sesión...</span>
                        </div>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ name: '', email: '', password: '' }}
                onSubmit={async (values, { setSubmitting }) => {
                  setIsLoading(true);
                  // Aquí iría la lógica de registro
                  alert(`Registrado: ${values.name}, ${values.email}`);
                  setIsLoading(false);
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange }) => (
                  <Form className="space-y-2 sm:space-y-2">
                    {/* Campo Nombre */}
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                        Nombre
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Nombre completo"
                        required
                      />
                    </div>

                    {/* Campo Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Correo electrónico"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="token" className="block text-xs font-medium text-gray-700">
                        Token de registro
                      </label>
                      <Field
                        id="token"
                        name="token"
                        type="text"
                        className="w-full pl-4 sm:pl-6 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Dame el token para registrarte"
                        required
                      />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                        Contraseña
                      </label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Contraseña"
                        required
                      />
                    </div>

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-teal-600 mt-3 cursor-pointer text-white py-1 sm:py-1 px-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Registrando...</span>
                        </div>
                      ) : (
                        'Registrarse'
                      )}
                    </button>
                  </Form>

                )}
              </Formik>
            )}

            {/* Footer */}
            <div className="mt-3 lg:mt-4 text-center">
              <p className="text-xs sm:text-xs text-gray-500 mb-1">
                {showRegister ? '¿Ya tienes una cuenta?' : '¿Necesitas acceso al sistema?'}
              </p>
              <button
                className="text-xs sm:text-sm underline cursor-pointer font-medium text-teal-600 hover:text-teal-900 transition-colors"
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister ? 'Inicia sesión aquí' : 'Registrate aquí'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;