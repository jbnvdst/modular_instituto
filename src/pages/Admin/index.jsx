import React, { useState } from "react";
import { Users, Building2, Shield, Plus, Edit2, Trash2, Search, UserCheck, AlertTriangle } from "lucide-react";
import { Layout } from "../../components/Layout";

const Admin = () => {
    const [activeTab, setActiveTab] = useState('usuarios');
    const [searchTerm, setSearchTerm] = useState('');

    // Datos de ejemplo
    const usuarios = [
        { id: 1, nombre: "Dr. María González", email: "maria.gonzalez@hospital.com", area: "Cardiología", rol: "Especialista", estado: "Activo" },
        { id: 2, nombre: "Dr. Enrique Rodríguez", email: "enrique.rodriguez@hospital.com", area: "Pediatría", rol: "Jefe de Área", estado: "Activo" },
        { id: 3, nombre: "Dr. Pedro Martínez", email: "pedro.martinez@hospital.com", area: "Urgencias", rol: "Especialista", estado: "Inactivo" },
        { id: 4, nombre: "Dra. Ana López", email: "ana.lopez@hospital.com", area: "Ginecología", rol: "Especialista", estado: "Activo" },
    ];

    const areas = [
        { id: 1, nombre: "Cardiología", color: "bg-red-100 border-red-200", icon: "❤️", personal: 8, activos: 7 },
        { id: 2, nombre: "Pediatría", color: "bg-blue-100 border-blue-200", icon: "👶", personal: 12, activos: 11 },
        { id: 3, nombre: "Urgencias", color: "bg-yellow-100 border-yellow-200", icon: "🚨", personal: 15, activos: 14 },
        { id: 4, nombre: "Ginecología", color: "bg-pink-100 border-pink-200", icon: "🏥", personal: 6, activos: 6 },
        { id: 5, nombre: "Traumatología", color: "bg-green-100 border-green-200", icon: "🦴", personal: 10, activos: 9 },
        { id: 6, nombre: "Neurología", color: "bg-purple-100 border-purple-200", icon: "🧠", personal: 7, activos: 6 },
    ];

    const jerarquia = [
        { nivel: 1, cargo: "Director General", personas: ["Dr. García"], color: "bg-teal-600" },
        { nivel: 2, cargo: "Jefes de Área", personas: ["Dr. Enrique Rodríguez", "Dra. Carmen Silva"], color: "bg-teal-500" },
        { nivel: 3, cargo: "Especialistas Senior", personas: ["Dr. María González", "Dr. Luis Torres", "Dra. Ana López"], color: "bg-teal-400" },
        { nivel: 4, cargo: "Especialistas", personas: ["Dr. Pedro Martínez", "Dra. Sofia Reyes", "Dr. Carlos Mendez", "Dra. Isabel Vega"], color: "bg-teal-300" },
    ];

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <Icon size={20} className="mr-2" />
            {label}
        </button>
    );

    const UsuariosTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                    <p className="text-gray-600 mt-1">Administra el personal médico del hospital</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center">
                    <Plus size={20} className="mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                                            <div className="text-sm text-gray-500">{usuario.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.rol}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            usuario.estado === 'Activo' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {usuario.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const AreasTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Áreas</h2>
                    <p className="text-gray-600 mt-1">Administra las áreas médicas del hospital</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center">
                    <Plus size={20} className="mr-2" />
                    Nueva Área
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area) => (
                    <div key={area.id} className={`bg-white rounded-lg border-2 ${area.color} p-6 hover:shadow-lg transition-shadow`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{area.icon}</span>
                                <h3 className="text-lg font-semibold text-gray-800">{area.nombre}</h3>
                            </div>
                            <div className="flex space-x-1">
                                <button className="text-blue-600 hover:text-blue-800 p-1">
                                    <Edit2 size={16} />
                                </button>
                                <button className="text-red-600 hover:text-red-800 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Personal Total:</span>
                                <span className="font-semibold text-gray-800">{area.personal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Activos:</span>
                                <span className="font-semibold text-green-600">{area.activos}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(area.activos / area.personal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const PermisosTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Permisos</h2>
                    <p className="text-gray-600 mt-1">Administra la jerarquía y permisos del hospital</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center">
                    <Shield size={20} className="mr-2" />
                    Configurar Permisos
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">Jerarquía Organizacional</h3>
                
                <div className="flex flex-col items-center space-y-6">
                    {jerarquia.map((nivel) => (
                        <div key={nivel.nivel} className="flex flex-col items-center">
                            <div className={`${nivel.color} text-white px-8 py-4 rounded-lg shadow-md min-w-64 text-center`}>
                                <h4 className="font-semibold text-lg">{nivel.cargo}</h4>
                                <div className="mt-2 space-y-1">
                                    {nivel.personas.map((persona, index) => (
                                        <div key={index} className="text-sm opacity-90 flex items-center justify-center">
                                            <UserCheck size={14} className="mr-1" />
                                            {persona}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {nivel.nivel < jerarquia.length && (
                                <div className="w-px h-8 bg-gray-300 relative">
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-300"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertTriangle className="text-yellow-600 mr-2" size={20} />
                        <p className="text-sm text-yellow-800">
                            Los permisos se heredan hacia abajo en la jerarquía. Los cambios en niveles superiores afectan a los subordinados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'usuarios': return <UsuariosTab />;
            case 'areas': return <AreasTab />;
            case 'permisos': return <PermisosTab />;
            default: return <UsuariosTab />;
        }
    };

    return (
        <Layout>
            <h1 className="text-sm text-gray-500">Gestiona usuarios, áreas y permisos del sistema hospitalario</h1>
            <hr className="my-4 border-gray-200"/>
            <div className=" max-w-7xl mx-auto">
                   
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                    <TabButton 
                        id="usuarios" 
                        label="Usuarios" 
                        icon={Users}
                        isActive={activeTab === 'usuarios'} 
                        onClick={setActiveTab} 
                    />
                    <TabButton 
                        id="areas" 
                        label="Áreas" 
                        icon={Building2}
                        isActive={activeTab === 'areas'} 
                        onClick={setActiveTab} 
                    />
                    <TabButton 
                        id="permisos" 
                        label="Permisos" 
                        icon={Shield}
                        isActive={activeTab === 'permisos'} 
                        onClick={setActiveTab} 
                    />
                </div>

                {/* Content */}
                {renderContent()}
            </div>
        </Layout>
    );
};

export default Admin;