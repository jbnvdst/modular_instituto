import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Activity, User, Lock, Eye, EyeOff } from 'lucide-react';
import { NavLink, useLocation } from "react-router-dom";
import docImage from '../../assets/img/doc.svg'; // Asegúrate de que la ruta sea correcta
import { useAuth } from '../../utils/context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'; // <-- Agrega esto
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate(); // <-- Agrega esto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  
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
            {!showRegister ? <LoginForm /> : <SignupForm setShowRegister={setShowRegister} />}

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