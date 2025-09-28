import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { User, Lock, Eye, EyeOff, AtSign, Hash } from 'lucide-react';
import { ModalAlert } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/context/AuthContext';
import * as Yup from 'yup';
import axios from 'axios';
import { useAreas } from '../../utils/context/AreasContext';

const SignupForm = ({ setShowRegister }) => {
    const { signup } = useAuth();
    const { areas, loadingAreas } = useAreas();
    const [areasByDirection, setAreasByDirection] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('El nombre es requerido'),
        email: Yup.string().email('Correo inválido').required('El correo es requerido'),
        password: Yup.string().min(8, 'Mínimo 8 caracteres').required('La contraseña es requerida'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
            .required('Confirma tu contraseña'),
        token: Yup.string().required('El token de acceso es requerido'),
    });

    const handleChangeToken = (e, handleChange) => {
        const token = e.target.value;
        handleChange(e); // actualiza el estado de Formik

        if (token === 'DMmedico') {
            setTokenValid('medico');
        } else if (token === 'DMjefatura') {
            setTokenValid('jefe de area');
        } else if (token === 'DMadmin') {
            setTokenValid('admin');
        } else if (token === '') {
            setTokenValid(false); // Token vacío ya no es válido
        } else {
            setTokenValid(false); // Token inválido
        }
    };

    const toggleArea = (areaId) => {
        setSelectedAreas((prev) => {
            const updated = prev.includes(areaId)
            ? prev.filter((id) => id !== areaId)
            : [...prev, areaId];

            // Actualiza el campo oculto de Formik
            setFieldValue('area', updated.join(','));
            return updated;
        });
    };

    useEffect(() => {
        if (areas && Array.isArray(areas)) {
            const groupedAreas = areas.reduce((acc, area) => {
                if (!acc[area.direction]) {
                    acc[area.direction] = [];
                }
                acc[area.direction].push(area);
                return acc;
            }, {});
            setAreasByDirection(groupedAreas);
        }
    }, [areas]);

    return (
        <Formik
            initialValues={{ 
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                token: '',
                area: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setIsLoading(true);

                // Validación adicional para asegurar que el token es válido
                if (!tokenValid || tokenValid === false) {
                    alert('Debes ingresar un token válido para registrarte');
                    setIsLoading(false);
                    setSubmitting(false);
                    return;
                }

                const valuesToSend = {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: tokenValid,
                    area: values.area,
                }
                console.log('Datos a enviar:', valuesToSend);
                console.log('Token valid state:', tokenValid);
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, valuesToSend, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 201) {
                        console.log('Registro exitoso:', response);
                        setShowAlert(true);
                        // navigate('/login');
                    }
                } catch (error) {
                    console.error('Error al registrar:', error);
                    console.error('Respuesta del servidor:', error.response?.data);
                    console.error('Status code:', error.response?.status);

                    // Manejar error de usuario existente
                    if (error.response?.status === 400 && error.response?.data?.message === 'El usuario ya existe') {
                        setErrorMessage('El usuario ya existe. Por favor, usa un correo electrónico diferente.');
                    } else {
                        setErrorMessage('Error al registrar usuario. Por favor, intenta nuevamente.');
                    }
                }
                setIsLoading(false);
                setSubmitting(false);
            }}
            >
            {({ setFieldValue }) => {
                const toggleArea = (id) => {
                    setFieldValue('area', id);
                    setSelectedAreas([id]); // Mantener como array para consistencia con el estado
                };
            return (
                <Form className="space-y-2 sm:space-y-2">
                {/* Mensaje de error */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                            <div className="text-red-600 text-sm">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                )}

                {/* Campo Nombre */}
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                        Nombre Completo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field
                            id="name"
                            name="name"
                            type="text"
                            className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                            placeholder="Nombre Completo"
                            required
                        />
                    </div>
                    <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>

                {/* Campo Usuario */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field name="email">
                            {({ field, form }) => (
                                <input
                                    {...field}
                                    id="email"
                                    type="text"
                                    className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                                    placeholder="Correo electrónico"
                                    onChange={(e) => {
                                        setErrorMessage(''); // Limpiar mensaje de error
                                        form.handleChange(e); // Mantener comportamiento de Formik
                                    }}
                                    required
                                />
                            )}
                        </Field>
                    </div>
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>

                {/* Campo Token  */}
                <div className="space-y-1">
                    <label htmlFor="token" className="block text-xs font-medium text-gray-700">
                        Token de acceso <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field name="token">
                            {({ field, form }) => (
                                <input
                                    {...field}
                                    id="token"
                                    type="password"
                                    onChange={(e) => handleChangeToken(e, form.handleChange)}
                                    className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                                    placeholder="Token de acceso"
                                    required
                                />
                            )}
                        </Field>
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
                    <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                        placeholder="Confirmar contraseña"
                        />
                    </div>
                    <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>

                {/* Areas */}
                <div className="space-y-1">
                    <label htmlFor="area" className="block text-xs font-medium text-gray-700">
                        Área de interés
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                        {loadingAreas ? (
                            <div className="w-full text-center text-xs text-gray-500">Cargando áreas...</div>
                        ) : areasByDirection && Object.entries(areasByDirection).map(([direction, areas]) => (
                            <div key={direction} className="flex flex-col w-full p-2 bg-gray-100 rounded-lg">
                                <h3 className="w-full text-xs text-center font-medium text-gray-800 mb-1">{direction}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {areas.map((area) => {
                                        const isSelected = Array.isArray(selectedAreas) ? selectedAreas.includes(area.id) : selectedAreas === area.id;
                                        return (
                                            <div
                                                key={area.id}
                                                onClick={() => toggleArea(area.id)}
                                                className={`cursor-pointer p-2 text-xs rounded-lg transition-all
                                                    ${isSelected ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                {area.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {!loadingAreas && (!areasByDirection || Object.keys(areasByDirection).length === 0) && (
                            <div className="w-full text-center text-xs text-gray-500">No hay áreas disponibles</div>
                        )}
                        <Field
                            id="area"
                            name="area"
                            type="hidden"
                            className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-xs"
                            placeholder="Área de interes"
                        />
                    </div>
                    <ErrorMessage
                        name="area"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={isLoading || tokenValid === false}
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
                {
                    showAlert && (
                        <ModalAlert 
                            title="Registro exitoso"
                            message="Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión."
                            confirmText="Ir a login"
                            onConfirm={() => {
                                setShowAlert(false);
                                setShowRegister(false);
                            }}
                        />
                        // <ModalAlert
                        //                 title="Confirmar Eliminación"
                        //                 message="¿Estás seguro de que deseas eliminar el área?"
                        //                 cancelText="Cancelar"
                        //                 confirmText="Eliminar"
                        //                 onCancel={() => setConfirmationAreaModal(null)}
                        //                 onConfirm={() => {
                        //                     handleDeleteArea(confirmationAreaModal);
                        //                     setConfirmationAreaModal(null);
                        //                 }}
                        //             />
                    )
                }
                </Form>

            )}}
        </Formik>
    );
};

export { SignupForm };