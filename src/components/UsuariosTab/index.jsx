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
        // if (filteredUsers.length === 0 )setSearchTerm('');
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
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                    <p className="text-gray-600 mt-1">Administra el personal médico del hospital</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedUser({});
                        setIsCreatingUser(true);
                    }}
                    className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Nuevo Usuario
                </button>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div onClick={() => console.log(user)} className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.areas.length > 0 ? user.areas.map(area => area.name).join(", ") :"No asignada"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button onClick={() => setSelectedUser(user)} className="text-blue-600 cursor-pointer hover:text-blue-800">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => setConfirmationModal(user.id)} className="text-red-600 cursor-pointer hover:text-red-800">
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
            {/* Edit User Modal */}
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
            {/* Confirmation Modal */}
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