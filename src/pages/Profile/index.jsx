import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Eye, EyeOff, Camera, Bell, Lock, Activity, Clock, Award, Stethoscope, Building2 } from "lucide-react";
import Layout from "../../components/Layout";

// Funciones para extraer datos del token
function getIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || null;
    } catch {
        return null;
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Utilidad para extraer solo la fecha para inputs tipo date
function getDateInputValue(dateString) {
    if (!dateString) return "";
    return dateString.split("T")[0];
}

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);

    // Estado del perfil
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        professionalLicense: "",
        inscribedAt: "",
        address: "",
        birthDate: "",
        role: "",
        department: ""
    });

    // Estadísticas del doctor
    const [stats, setStats] = useState([]);

    // Actividad reciente
    const [actividadReciente, setActividadReciente] = useState([]);

    const getProfilePictureByToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.profilePicture ? `http://localhost:4000/${payload.profilePicture}` : null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const id = getIdFromToken();
        if (!id) return;

        setLoading(true);

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get/`)
            .then(res => {
                const usuario = res.data.find(u => u.id === id);
                if (usuario) {
                    setProfileData({
                        name: usuario.name || "",
                        email: usuario.email || "",
                        phone: usuario.phone || "",
                        specialty: usuario.specialty || "",
                        professionalLicense: usuario.professionalLicense || "",
                        inscribedAt: usuario.inscribedAt || "",
                        address: usuario.address || "",
                        birthDate: usuario.birthDate || "",
                        role: usuario.role || "",
                        department: usuario.department || ""
                    });
                }
            })
            .catch(() => {
                setProfileData({
                    name: "",
                    email: "",
                    phone: "",
                    specialty: "",
                    professionalLicense: "",
                    inscribedAt: "",
                    address: "",
                    birthDate: "",
                    role: "",
                    department: ""
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const id = getIdFromToken();
            if (!id) return;
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/update/${id}`,
                profileData
            );
            setIsEditing(false);
        } catch (error) {
            alert("Error al actualizar el perfil");
        }
    };

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                isActive 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <Icon size={14} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
        </button>
    );

    const InfoField = ({ label, value, field, type = "text", icon: Icon }) => (
        <div className="space-y-2">
            <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700" htmlFor={field}>
                <Icon size={14} className="mr-1 sm:mr-2 text-gray-500" />
                {label}
            </label>
            {isEditing ? (
                <input
                    id={field}
                    name={field}
                    type={type}
                    value={type === "date" ? getDateInputValue(value) : value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    autoComplete="off"
                />
            ) : (
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                    {value && value !== "" ? (type === "date" ? formatDate(value) : value) : "No especificado"}
                </p>
            )}
        </div>
    );

    const PersonalTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Nombre" value={profileData.name} field="name" icon={User} />
                <InfoField label="Correo" value={profileData.email} field="email" type="email" icon={Mail} />
                <InfoField label="Teléfono" value={profileData.phone} field="phone" icon={Phone} />
                <InfoField
                    label="Fecha de Nacimiento"
                    value={profileData.birthDate}
                    field="birthDate"
                    type="date"
                    icon={Calendar}
                />
                <InfoField label="Especialidad" value={profileData.specialty} field="specialty" icon={Stethoscope} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <InfoField label="Dirección" value={profileData.address} field="address" icon={MapPin} />
            </div>
        </div>
    );

    const ProfesionalTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Cédula Profesional" value={profileData.professionalLicense} field="professionalLicense" icon={Shield} />
                <InfoField label="Departamento" value={profileData.department} field="department" icon={Building2} />
                <InfoField
                    label="Fecha de Ingreso"
                    value={profileData.inscribedAt}
                    field="inscribedAt"
                    type="date"
                    icon={Calendar}
                />
            </div>
            {/* Estadísticas */}
            {/* <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <stat.icon className={`${stat.color} mr-2 sm:mr-3 flex-shrink-0`} size={20} />
                                <div className="min-w-0">
                                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );

    const ActividadTab = () => (
        <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Actividad Reciente</h3>
            <div className="space-y-2 sm:space-y-3">
                {actividadReciente.map((actividad, index) => (
                    <div key={index} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1 min-w-0">
                                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0 ${
                                    actividad.tipo === 'emergencia' ? 'bg-red-500' :
                                    actividad.tipo === 'consulta' ? 'bg-blue-500' :
                                    actividad.tipo === 'admin' ? 'bg-purple-500' :
                                    'bg-green-500'
                                }`}></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{actividad.accion}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                                        {actividad.paciente || actividad.descripcion}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{actividad.tiempo}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ConfiguracionTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Seguridad</h3>
                <div className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            <Lock size={14} className="mr-1 sm:mr-2 text-gray-500" />
                            Cambiar Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nueva contraseña"
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-8 sm:pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Notificaciones</h3>
                <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2 sm:mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                        <span className="text-xs sm:text-sm text-gray-700">Notificaciones de emergencia</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2 sm:mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                        <span className="text-xs sm:text-sm text-gray-700">Recordatorios de citas</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2 sm:mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-xs sm:text-sm text-gray-700">Notificaciones por email</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'personal': return <PersonalTab />;
            case 'profesional': return <ProfesionalTab />;
            case 'actividad': return <ActividadTab />;
            case 'configuracion': return <ConfiguracionTab />;
            default: return <PersonalTab />;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-t-4 border-b-4 border-teal-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-3 sm:p-6">
                {/* Header del perfil */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8 text-white">
                    <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                            <div className="relative mb-3 sm:mb-0" style={{ 
                                backgroundImage: `url(${getProfilePictureByToken()})`, 
                                backgroundSize: 'cover', 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '50%', 
                                backgroundPosition: 'center' 
                            }}>
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-opacity-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white text-teal-600 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="sm:ml-6">
                                <h1 className="text-xl sm:text-3xl font-bold">
                                    {profileData.name || "No especificado"} 
                                </h1>
                                <p className="text-base sm:text-xl opacity-90">{profileData.role || "No especificado"}</p>
                                <p className="text-sm sm:text-lg opacity-75">
                                    {profileData.specialty || "No especificado"} • {profileData.department || "No especificado"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={handleSave}
                                        className="bg-white text-teal-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm sm:text-base"
                                    >
                                        <Save size={14} className="mr-1 sm:mr-2" />
                                        Guardar
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm sm:text-base"
                                    >
                                        <X size={14} className="mr-1 sm:mr-2" />
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-teal-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm sm:text-base"
                                >
                                    <Edit2 size={14} className="mr-1 sm:mr-2" />
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs - Scrollable en móvil */}
                <div className="overflow-x-auto mb-4 sm:mb-8">
                    <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg w-fit min-w-full sm:min-w-0">
                        <TabButton 
                            id="personal" 
                            label="Información Personal" 
                            icon={User}
                            isActive={activeTab === 'personal'} 
                            onClick={setActiveTab} 
                        />
                        <TabButton 
                            id="profesional" 
                            label="Información Profesional" 
                            icon={Stethoscope}
                            isActive={activeTab === 'profesional'} 
                            onClick={setActiveTab} 
                        />
                        {/* <TabButton 
                            id="actividad" 
                            label="Actividad" 
                            icon={Activity}
                            isActive={activeTab === 'actividad'} 
                            onClick={setActiveTab} 
                        /> */}
                        <TabButton 
                            id="configuracion" 
                            label="Configuración" 
                            icon={Lock}
                            isActive={activeTab === 'configuracion'} 
                            onClick={setActiveTab} 
                        />
                    </div>
                </div>

                {/* Contenido de las tabs */}
                <div className="bg-gray-50 p-3 sm:p-6 rounded-lg">
                    {renderTabContent()}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;