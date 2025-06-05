import React, { useContext, useState, useEffect, use } from "react";
import { Users, Building2, Shield, Plus, Edit2, Trash2, Search, UserCheck, AlertTriangle } from "lucide-react";
import  Layout  from "../../components/Layout";
import axios from "axios";
import { UsuariosTab } from "../../components/UsuariosTab";
import { AreasTab } from "../../components/AreasTab";

const Admin = () => {
    const [ activeTab, setActiveTab] = useState('usuarios');
    const [ users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const reponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get`);
            setUsers(reponse.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const jerarquia = [
        { nivel: 1, cargo: "Director General", personas: ["Dr. García"], color: "bg-teal-600" },
        { nivel: 2, cargo: "Jefes de Área", personas: ["Dr. Enrique Rodríguez", "Dra. Carmen Silva"], color: "bg-teal-500" },
        { nivel: 3, cargo: "Especialistas Senior", personas: ["Dr. María González", "Dr. Luis Torres", "Dra. Ana López"], color: "bg-teal-400" },
        { nivel: 4, cargo: "Especialistas", personas: ["Dr. Pedro Martínez", "Dra. Sofia Reyes", "Dr. Carlos Mendez", "Dra. Isabel Vega"], color: "bg-teal-300" },
    ];


    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-6 py-3 cursor-pointer font-medium rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <Icon size={20} className="mr-2" />
            {label}
        </button>
    );


    const PermisosTab = () => (
        <div className="flex flex-col gap-3 pb-5">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Permisos</h2>
                    <p className="text-gray-600 mt-1">Administra la jerarquía y permisos del hospital</p>
                </div>
                <button className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">
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
            // case 'usuarios': return <UsuariosTab />;
            case 'areas': return <AreasTab users={users}/>;
            case 'permisos': return <PermisosTab />;
            default: return <UsuariosTab users={users} setUsers={setUsers} fetchUsers={fetchUsers} />;
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