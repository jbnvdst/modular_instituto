import React, { useContext, useState, useEffect, use } from "react";
import { Users, Building2, Shield, Plus, Edit2, Trash2, Search, UserCheck, AlertTriangle } from "lucide-react";
import axios from "axios";
import { UsuariosTab, AreasTab, SubAreasTab, TabButton } from '../../components';
import Layout from "../../components/Layout";

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


    const renderContent = () => {
        switch(activeTab) {
            // case 'usuarios': return <UsuariosTab />;
            case 'areas': return <AreasTab users={users}/>;
            case 'subareas': return <SubAreasTab />;
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
                        id="subareas" 
                        label="Necesidades" 
                        icon={Shield}
                        isActive={activeTab === 'subareas'} 
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