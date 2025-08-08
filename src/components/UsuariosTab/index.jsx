import React, { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { EditUser } from "../EditUser";
import { ModalAlert } from "../ModalAlert";
import axios from 'axios';

const UsuariosTab = ({users, setUsers, fetchUsers}) => {
    const [ searchTerm, setSearchTerm] = useState('');
    const [ selectedUser, setSelectedUser] = useState(null);
    const [ isCreatingUser, setIsCreatingUser] = useState(false);
    const [ confirmationModal, setConfirmationModal] = useState(null);
    const [ filteredUsers, setFilteredUsers ] = useState([]);

    useEffect(() => {
        if (searchTerm === ''){ 
            setFilteredUsers(users);
        }
        else{
            setFilteredUsers(users.filter(u => (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.role.includes(searchTerm.toLowerCase()) || u.areas.some(area => area.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())))));
        }
    }, [searchTerm, users])

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/auth/delete/${userId}`);
            if (response.status === 200) {
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
            } else {
                console.error("Error al eliminar el usuario:", response.data);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
        setConfirmationModal(null);
    };

    return(
        <div className="flex flex-col gap-3 pb-5">
            {/* Header responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Gestión de Usuarios
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Administra el personal médico del hospital
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedUser({});
                        setIsCreatingUser(true);
                    }}
                    className="flex items-center justify-center w-full sm:w-auto 
                             px-3 sm:px-4 py-2 border-2 rounded-full 
                             text-xs sm:text-sm font-semibold cursor-pointer 
                             hover:bg-gray-200 hover:text-teal-500 duration-200"
                >
                    <Plus size={18} className="mr-1.5 sm:mr-2" />
                    Nuevo Usuario
                </button>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* Barra de búsqueda responsive */}
                <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 
                                     border border-gray-300 rounded-lg 
                                     text-sm sm:text-base
                                     focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Vista móvil - Cards */}
                <div className="block lg:hidden">
                    <div className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div onClick={() => console.log(user)} 
                                             className="font-semibold text-gray-900 text-sm">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {user.email}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                
                                <div className="space-y-1 text-xs text-gray-600 mb-3">
                                    <div className="flex">
                                        <span className="font-medium mr-2">Área:</span>
                                        <span className="text-gray-900">
                                            {user.areas.length > 0 
                                                ? user.areas.map(area => area.name).join(", ") 
                                                : "No asignada"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-medium mr-2">Rol:</span>
                                        <span className="text-gray-900">{user.role}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setSelectedUser(user)} 
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setConfirmationModal(user.id)} 
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vista desktop - Tabla */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Área
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div onClick={() => console.log(user)} 
                                                 className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.areas.length > 0 
                                            ? user.areas.map(area => area.name).join(", ") 
                                            : "No asignada"}
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.role}
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => setSelectedUser(user)} 
                                                className="text-blue-600 cursor-pointer hover:text-blue-800 p-1"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmationModal(user.id)} 
                                                className="text-red-600 cursor-pointer hover:text-red-800 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mensaje cuando no hay usuarios */}
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-sm">No se encontraron usuarios</p>
                    </div>
                )}
            </div>
            
            {/* Modales - Ya son responsive por defecto */}
            {selectedUser !== null && (
                <EditUser
                    user={selectedUser}
                    setUsers={setUsers}
                    onClick={() => {
                        setSelectedUser(null);
                        setIsCreatingUser(false);
                    }}
                    fetchUsers={fetchUsers}
                    isCreating={isCreatingUser}
                />
            )}
            
            {confirmationModal !== null && (
                <ModalAlert
                    title="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar al usuario?"
                    cancelText="Cancelar"
                    confirmText="Eliminar"
                    onCancel={() => setConfirmationModal(null)}
                    onConfirm={() => {
                        handleDeleteUser(confirmationModal)
                    }}
                />
            )}
        </div>
    )
};

export { UsuariosTab }