import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Activity, User, Lock, Eye, EyeOff } from 'lucide-react';
import { NavLink, useLocation } from "react-router-dom";
import docImage from '../../assets/img/doc.svg';
import { useAuth } from '../../utils/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
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
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden min-h-[30vh] sm:min-h-[40vh] lg:min-h-screen">
        
        {/* Elementos decorativos del fondo */}
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 lg:top-20 lg:left-20 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 lg:bottom-20 lg:right-20 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Contenido principal de la ilustración */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-6 sm:p-8 lg:p-12">
          
          <img 
            src={docImage} 
            alt="Doctor" 
            className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover mb-3 sm:mb-4 lg:mb-6" 
          />

          {/* Texto descriptivo */}
          <div className="text-center max-w-xs sm:max-w-sm lg:max-w-md">
            <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-6 leading-tight">
              Tecnología Médica
              <span className="block text-teal-200 text-base xs:text-lg sm:text-xl lg:text-2xl mt-1">del Futuro</span>
            </h2>
            <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-teal-100 leading-relaxed px-2 sm:px-0">
              Plataforma integral para la gestión médica moderna. Seguridad, eficiencia y cuidado del paciente en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-12 min-h-[70vh] lg:min-h-screen">
        <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-md">
          <div className="bg-white rounded-lg xs:rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl p-5 xs:p-6 sm:p-8">
            
            {/* Logo y título */}
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-teal-600 rounded-lg xs:rounded-xl lg:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <Activity className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
              </div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                Portal Médico
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                {showRegister ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
              </p>
            </div>
 
            {/* Formulario Login o Registro */}
            <div className="space-y-4">
              {!showRegister ? <LoginForm /> : <SignupForm setShowRegister={setShowRegister} />}
            </div> 

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2">
                {showRegister ? '¿Ya tienes una cuenta?' : '¿Necesitas acceso al sistema?'}
              </p>
              <button
                className="text-sm xs:text-base sm:text-base font-semibold text-teal-600 hover:text-teal-700 transition-colors underline underline-offset-2"
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister ? 'Inicia sesión aquí' : 'Regístrate aquí'}
              </button>
            </div>

            {/* Información adicional para móviles */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 lg:hidden">
              <p className="text-xs text-center text-gray-500">
                © 2024 Portal Médico. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;