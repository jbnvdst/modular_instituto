import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Eye, EyeOff, Camera, Bell, Lock, Activity, Clock, Award, Stethoscope, Building2 } from "lucide-react";
import  Layout  from "../../components/Layout";

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

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);

    // Estado del perfil
    const [profileData, setProfileData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        especialidad: "",
        cedula: "",
        fechaIngreso: "",
        direccion: "",
        fechaNacimiento: "",
        cargo: "",
        departamento: ""
    });

    // Estadísticas del doctor
    const [stats, setStats] = useState([]);

    // Actividad reciente
    const [actividadReciente, setActividadReciente] = useState([]);
    
    const getProfilePictureByToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return profilePic; // Retorna imagen por defecto si no hay token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.profilePicture ? `http://localhost:4000/${payload.profilePicture}` : profilePic; // Retorna la imagen del perfil si existe, o la imagen por defecto
        } catch {
            return profilePic; // Retorna imagen por defecto si hay un error al decodificar el token
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
                        nombre: usuario.name || "",
                        apellido: "", // No viene en la API
                        email: usuario.email || "",
                        telefono: "",
                        especialidad: "",
                        cedula: "",
                        fechaIngreso: "",
                        direccion: "",
                        fechaNacimiento: "",
                        cargo: usuario.role || "",
                        departamento: ""
                    });
                }
            })
            .catch(() => {
                setProfileData({
                    nombre: "",
                    apellido: "",
                    email: "",
                    telefono: "",
                    especialidad: "",
                    cedula: "",
                    fechaIngreso: "",
                    direccion: "",
                    fechaNacimiento: "",
                    cargo: "",
                    departamento: ""
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData({ ...profileData, [field]: value });
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <Icon size={16} className="mr-2" />
            {label}
        </button>
    );

    const InfoField = ({ label, value, field, type = "text", icon: Icon }) => (
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Icon size={16} className="mr-2 text-gray-500" />
                {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {value && value !== "" ? value : "No especificado"}
                </p>
            )}
        </div>
    );

    const PersonalTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Nombre" value={profileData.nombre} field="nombre" icon={User} />
                <InfoField label="Apellido" value={profileData.apellido} field="apellido" icon={User} />
                <InfoField label="Email" value={profileData.email} field="email" type="email" icon={Mail} name="profile-email" autoComplete="email" />
                <InfoField label="Teléfono" value={profileData.telefono} field="telefono" icon={Phone} />
                <InfoField label="Fecha de Nacimiento" value={profileData.fechaNacimiento} field="fechaNacimiento" type="date" icon={Calendar} />
                <InfoField label="Especialidad" value={profileData.especialidad} field="especialidad" icon={Stethoscope} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <InfoField label="Dirección" value={profileData.direccion} field="direccion" icon={MapPin} />
            </div>
        </div>
    );

    const ProfesionalTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Cédula Profesional" value={profileData.cedula} field="cedula" icon={Shield} />
                <InfoField label="Cargo" value={profileData.cargo} field="cargo" icon={Award} />
                <InfoField label="Departamento" value={profileData.departamento} field="departamento" icon={Building2} />
                <InfoField label="Fecha de Ingreso" value={profileData.fechaIngreso} field="fechaIngreso" type="date" icon={Calendar} />
            </div>

            {/* Estadísticas */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <stat.icon className={`${stat.color} mr-3`} size={24} />
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const ActividadTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
            <div className="space-y-3">
                {actividadReciente.map((actividad, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start">
                                <div className={`w-3 h-3 rounded-full mt-2 mr-3 ${
                                    actividad.tipo === 'emergencia' ? 'bg-red-500' :
                                    actividad.tipo === 'consulta' ? 'bg-blue-500' :
                                    actividad.tipo === 'admin' ? 'bg-purple-500' :
                                    'bg-green-500'
                                }`}></div>
                                <div>
                                    <p className="font-medium text-gray-800">{actividad.accion}</p>
                                    <p className="text-sm text-gray-600">
                                        {actividad.paciente || actividad.descripcion}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{actividad.tiempo}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ConfiguracionTab = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seguridad</h3>
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Lock size={16} className="mr-2 text-gray-500" />
                            Cambiar Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nueva contraseña"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                        <span className="text-sm text-gray-700">Notificaciones de emergencia</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                        <span className="text-sm text-gray-700">Recordatorios de citas</span>
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">Notificaciones por email</span>
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
                    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-teal-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header del perfil */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="relative" style={{ backgroundImage: `url(${getProfilePictureByToken()})`, backgroundSize: 'cover', width: '96px', height: '96px', borderRadius: '50%', backgroundPosition: 'center' }}>
                                <div className="w-24 h-24 bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                                    {/* {(profileData.nombre?.charAt(0) || "") + (profileData.apellido?.charAt(0) || "")} */}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white text-teal-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="ml-6">
                                <h1 className="text-3xl font-bold">
                                    {profileData.nombre || "No especificado"} {profileData.apellido || ""}
                                </h1>
                                <p className="text-xl opacity-90">{profileData.cargo || "No especificado"}</p>
                                <p className="text-lg opacity-75">
                                    {profileData.especialidad || "No especificado"} • {profileData.departamento || "No especificado"}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={handleSave}
                                        className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Guardar
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                    >
                                        <X size={16} className="mr-2" />
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
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
                    <TabButton 
                        id="actividad" 
                        label="Actividad" 
                        icon={Activity}
                        isActive={activeTab === 'actividad'} 
                        onClick={setActiveTab} 
                    />
                    <TabButton 
                        id="configuracion" 
                        label="Configuración" 
                        icon={Lock}
                        isActive={activeTab === 'configuracion'} 
                        onClick={setActiveTab} 
                    />
                </div>

                {/* Contenido de las tabs */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    {renderTabContent()}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;