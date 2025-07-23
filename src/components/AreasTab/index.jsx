import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, } from "lucide-react";
import { useAreas } from "../../utils/context/AreasContext";
import { Formik, Form, Field } from "formik";
import { EditArea } from "../EditArea";
import { ModalAlert } from '../ModalAlert';
import axios from "axios";


const AreasTab = ({ users}) => {
    const [ isEditingPersonal, setIsEditingPersonal ] = useState(false);
    const [ selectedPersonal , setSelectedPersonal ] = useState({});
    const [ selectedArea, setSelectedArea ] = useState(null);
    const [ directions, setDirections ] = useState([]);
    const { areas, setAreas, fetchAreas } = useAreas(); 
    const [ personalInArea, setPersonalInArea ] = useState([]);
    const [ areaToEdit, setAreaToEdit] = useState(null);
    const [ isCreatingArea, setIsCreatingArea] = useState(false);
    const [ confirmationAreaModal, setConfirmationAreaModal] = useState(null);
    const [ userToEdit, setUserToEdit ] = useState(null);
    const isEditMode = !!userToEdit?.id;
    const [ confirmationDeletePersonal , setConfirmationDeletePersonal] = useState(null);
    
    useEffect(() => {
        fetchDirections();
    }, []);

    useEffect(() => {
        fetchPersonal();
    }, [selectedArea]);

    const handleEditPersonal = (user) => {
        setUserToEdit(user);
        setIsEditingPersonal(true);
    }

    const handleDeletePersonal = async (userId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas/`, {
                data: {
                    userId: userId,
                    areaId: selectedArea.id,
                }
            });
            if (response.status === 200) {
                setPersonalInArea((prev) => prev.filter(user => user.id !== userId));
            } else {
                console.error("Error al eliminar el usuario:", response.data);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
        setConfirmationDeletePersonal(null);
    };

    const fetchPersonal = async () => {
        try {
            if (!selectedArea) return; // No hay área seleccionada
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas/getUsers/${selectedArea.id}`);
            setPersonalInArea(response.data);
        } catch (error) {
            console.error("Error fetching personal in area:", error);
        }
    };

    const fetchDirections = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/area/getDirections`);
            if (response.status === 200) {
                setDirections(response.data);
            } else {
                console.error("Error fetching directions:", response.data);
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
        }
    };

    const filterPersonal = () => {
        const personalInAreaIds = new Set(personalInArea.map(user => user.id));
        const filteredUsers = users.filter(user => !personalInAreaIds.has(user.id));
        return filteredUsers;
    }
    

    const handleDeleteArea = async (areaId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/area/${areaId}`);
            if (response.status === 200) {
                setAreas((prevAreas) => prevAreas.filter(area => area.id !== areaId));
                setConfirmationAreaModal(null);
            } else {
                alert("Error al eliminar el área.");
            }
        } catch (error) {
            alert("Error al eliminar el área.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-3 pb-5">
        <div className="flex justify-between items-center">
            {selectedArea ? (
            <div className="flex w-full justify-between items-center">
                <h1
                onClick={() => console.log(selectedArea)}
                className="text-2xl font-bold text-gray-800"
                >
                Área: {selectedArea.name}
                </h1>
                <button
                onClick={() => setSelectedArea(null)}
                className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200"
                >
                Volver
                </button>
            </div>
            ) : (
            <div className="flex w-full justify-between items-center">
                <div>
                    <h2
                        onClick={() => console.log(areas)}
                        className="text-2xl font-bold text-gray-800"
                    >
                        Gestión de Áreas
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Administra las áreas médicas del hospital
                    </p>
                </div>
                <button
                onClick={() => {
                    setAreaToEdit({});
                    setIsCreatingArea(true);
                }}
                className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200"
                >
                <Plus size={20} className="mr-2" />
                Nueva Área
                </button>
            </div>
            )}
        </div>

        {!selectedArea && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {areas.map((area) => (
                <div
                key={area.id}
                className={`h-full flex flex-col bg-white justify-between ${area.color} rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-shadow`}
                >
                <div className="flex items-center justify-between mb-4 rounded-t-2xl px-4 py-3 bg-gradient-to-tr from-emerald-500 to-teal-600">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-white">{area.name}</h2>
                    </div>
                    <div className="flex space-x-1">
                    <button
                        className="cursor-pointer text-white hover:text-gray-800 p-1"
                        onClick={() => {
                        setAreaToEdit(area);
                        setIsCreatingArea(false);
                        }}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="cursor-pointer text-red-600 hover:text-red-800 p-1"
                        onClick={() => setConfirmationAreaModal(area.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                    </div>
                </div>

                <div className="flex flex-col justify-between items-start px-4 pb-4 gap-2">
                    <span className="text-sm text-gray-800"><b>Dirección:</b> {area.direction}</span>
                    <span className="text-sm text-gray-800"><b>Encargado:</b> {area.ownerUser.name}</span>
                    <p className="text-sm text-gray-800">{area.description}</p>
                </div>

                <div className="flex flex-col items-end px-4 gap-4 pb-4">
                    <div className="flex w-full items-center gap-2">
                    <span className="text-sm text-gray-600">Personal Total:</span>
                    <span className="font-semibold text-gray-800">{area.usersCount}</span>
                    </div>

                    <button
                    onClick={() => setSelectedArea(area)}
                    className="flex justify-end px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200"
                    >
                    <h1>Gestionar personal</h1>
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}

        {selectedArea && (
            <div className="w-full flex flex-col gap-6">
                <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <h3 onClick={() => console.log(personalInArea)} className="text-lg font-semibold text-gray-800 mb-4">Personal Asignado</h3>
                        <button
                            onClick={() => {
                                setIsEditingPersonal(true); 
                                setSelectedPersonal({});
                            }}
                            className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">
                            <Plus size={20} className="mr-2" />
                            Agregar Personal
                        </button>
                    </div>



                    {/* Formulario para agregar nuevo personal */}
                    {isEditingPersonal && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <h4 className="text-md font-medium text-gray-700 mb-4">
                            {userToEdit?.id ? "Editar Personal" : "Nuevo Personal"}
                            </h4>

                            <Formik
                            enableReinitialize
                            initialValues={{
                                userId: userToEdit?.id || '',
                                name: userToEdit?.name || '',
                                role: userToEdit?.role || '',
                            }}
                            onSubmit={async (values, { resetForm, setSubmitting }) => {
                                setSubmitting(true);
                                try {

                                    await new Promise(resolve => setTimeout(resolve, 5000));

                                if (userToEdit?.id) {
                                    // 🛠 Modo edición
                                    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas`, {
                                        role: values.role,
                                        areaId: selectedArea.id,
                                        userId: userToEdit.id,
                                    });

                                    if (response.status === 200) {
                                    // Actualiza la lista
                                    setPersonalInArea((prev) =>
                                        prev.map((p) =>
                                        p.id === userToEdit.id
                                            ? {
                                                ...p,
                                                name: values.name,
                                                areas: [
                                                {
                                                    id: selectedArea.id,
                                                    UserArea: {
                                                    role: values.role,
                                                    },
                                                },
                                                ],
                                            }
                                            : p
                                        )
                                    );
                                    }
                                } else {
                                    // ➕ Modo agregar
                                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas`, {
                                        userId: values.userId,
                                        areaId: selectedArea.id,
                                        role: values.role,
                                    });

                                    if (response.status === 200) {
                                    const newPersonal = {
                                        ...response.data.user,
                                        areas: [
                                        {
                                            id: selectedArea.id,
                                            UserArea: {
                                                role: values.role,
                                            },
                                        },
                                        ],
                                    };
                                    setPersonalInArea((prev) => [...prev, newPersonal]);
                                    }
                                }
                                } catch (error) {
                                console.error("Error al guardar usuario:", error);
                                }
                                finally{
                                    setSubmitting(false);
                                }

                                resetForm();
                                setUserToEdit(null);
                                setIsEditingPersonal(false);
                            }}
                            >
                            {({ resetForm, isSubmitting }) => (
                                <Form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!userToEdit?.id && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Usuario
                                        </label>
                                        <Field
                                        as="select"
                                        name="userId"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        >
                                        <option value="">Seleccionar usuario</option>
                                        {filterPersonal().map((user) => (
                                            <option key={user.id} value={user.id}>
                                            {user.name}
                                            </option>
                                        ))}
                                        </Field>
                                    </div>
                                    )}

                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                    <Field
                                        as="select"
                                        name="role"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccionar rol</option>
                                        <option value="subjefe">Sub jefe de área</option>
                                        <option value="miembro">Miembro</option>
                                    </Field>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsEditingPersonal(false);
                                        setUserToEdit(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    disabled={isSubmitting}
                                    >
                                    Cancelar
                                    </button>
                                    <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                     {userToEdit?.id ? (isSubmitting ? "Guardando..." : "Guardar cambios") : (isSubmitting ? "Agregando..." : "Agregar")}
                                    </button>
                                </div>
                                </Form>
                            )}
                            </Formik>
                        </div>
                        )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {personalInArea.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.areas[0].UserArea.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEditPersonal(user)} className="text-blue-600 cursor-pointer hover:text-blue-800">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => setConfirmationDeletePersonal(user.id)} className="text-red-600 cursor-pointer hover:text-red-800">
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
        )}
        {/* Edit Area Modal */}
        {areaToEdit !== null && (
            <EditArea
                area={areaToEdit} 
                onClick={() => {
                    setAreaToEdit(null);
                    setIsCreatingArea(false);
                }}
                isCreating={isCreatingArea}
                fetchAreas={fetchAreas}
                users={users}
                directions={directions}
            />
        )}
        {/* Confirmation Area Modal */}
        {confirmationAreaModal !== null && (
            <ModalAlert
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar el área?"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmationAreaModal(null)}
                onConfirm={() => {
                    handleDeleteArea(confirmationAreaModal);
                    setConfirmationAreaModal(null);
                }}
            />
        )}
        {confirmationDeletePersonal !== null && (
            <ModalAlert
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar el usuario de esta área?"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setConfirmationDeletePersonal(null)}
                onConfirm={() => {
                    handleDeletePersonal(confirmationDeletePersonal);
                    setConfirmationDeletePersonal(null);
                }}
            />
        )}
    </div>
    );
};

export {AreasTab}