import React, { useState } from "react";
import { Formik, Form, Field } from 'formik';
import { User, Lock, Eye, EyeOff, AtSign } from 'lucide-react';
import { useAuth } from '../../utils/context/AuthContext';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAuth();

    return (
        <Formik
            initialValues={{ email: '', password: '', remember: false }}
            onSubmit={async (values, { setSubmitting }) => {
                setIsLoading(true);
                try {
                    const user = await login(values.email, values.password);
                    console.log(user);
                    
                    if (user) {
                        localStorage.setItem("user", JSON.stringify({
                            name: user.name,
                            email: user.email,
                            profilePicture: user.profilePicture || null,
                        }));
                        // navigate('/home');
                    }
                } catch(error) {
                    alert('Credenciales incorrectas', error.message);
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
                        Correo electrónico
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <Field
                        id="email"
                        name="email"
                        type="text"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Correo electrónico"
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
    );
};

export { LoginForm };
