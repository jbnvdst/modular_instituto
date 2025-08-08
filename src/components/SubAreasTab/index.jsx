import axios from "axios";
import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { EditSubArea } from "../EditSubArea";
import { ModalAlert } from "../ModalAlert";

const SubAreasTab = () => {
    const [ subAreas, setSubAreas ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ selectedSubArea, setSelectedSubArea ] = useState(null);
    const [ isCreatingSubArea, setIsCreatingSubArea] = useState(false);
    const [ confirmationModal, setConfirmationModal] = useState(null);
    const [ filteredSubAreas, setFilteredSubAreas ] = useState([]);

    useEffect(() => {
        fetchSubAreas();
    }, []);
     
    useEffect(() => {
        if (searchTerm === ''){ 
            setFilteredSubAreas(subAreas);
        }
        else{
            setFilteredSubAreas(subAreas.filter(s => (s.name.toLowerCase().includes(searchTerm.toLowerCase()))));
        }
    }, [searchTerm, subAreas])
    
    const fetchSubAreas = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sub-area/tasks-count`);
            setFilteredSubAreas(response.data);
        } catch (error) {
            console.error("Error fetching subareas:", error);
        }
    }

    const handleDeleteSubArea = async (subAreaId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/sub-area/${subAreaId}`);
            if (response.status === 200) {
                fetchSubAreas();
            } else {
                console.error("Error al eliminar el usuario:", response.data);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
        setConfirmationModal(null);
    };

    return (
        <div className="flex flex-col gap-3 pb-5">
            {/* Header responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                    <h2 onClick={() => console.log(subAreas)} className="text-xl sm:text-2xl font-bold text-gray-800">
                        Gestión de Subareas por necesidad
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Administra las subáreas de necesidad del hospital
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedSubArea({});
                        setIsCreatingSubArea(true);
                    }}
                    className="flex items-center justify-center w-full sm:w-auto 
                             px-3 sm:px-4 py-2 border-2 rounded-full 
                             text-xs sm:text-sm font-semibold cursor-pointer 
                             hover:bg-gray-200 hover:text-teal-500 duration-200"
                >
                    <Plus size={18} className="mr-1.5 sm:mr-2" />
                    Nueva Subárea
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* Vista móvil - Cards */}
                <div className="block lg:hidden">
                    <div className="divide-y divide-gray-200">
                        {filteredSubAreas.map((subarea) => (
                            <div key={subarea.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div onClick={() => console.log(subarea)} 
                                             className="font-semibold text-gray-900 text-sm">
                                            {subarea.name}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {subarea.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-2">
                                        <button 
                                            onClick={() => setSelectedSubArea(subarea)} 
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setConfirmationModal(subarea.id)} 
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Total de tareas:</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {subarea.taskCount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredSubAreas.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">No se encontraron subáreas</p>
                        </div>
                    )}
                </div>

                {/* Vista desktop - Tabla */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total de tareas
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubAreas.map((subarea) => (
                                <tr key={subarea.id} className="hover:bg-gray-50">
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                                        <div onClick={() => console.log(subarea)} 
                                             className="text-sm font-medium text-gray-900">
                                            {subarea.name}
                                        </div>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4">
                                        <p className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                                            {subarea.description}
                                        </p>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {subarea.taskCount}
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => setSelectedSubArea(subarea)} 
                                                className="text-blue-600 cursor-pointer hover:text-blue-800 p-1"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmationModal(subarea.id)} 
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
                    
                    {filteredSubAreas.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">No se encontraron subáreas</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales - Ya son responsive por defecto */}
            {selectedSubArea !== null && (
                <EditSubArea
                    subArea={selectedSubArea}
                    setSubAreas={setSubAreas}
                    onClick={() => {
                        setSelectedSubArea(null);
                        setIsCreatingSubArea(false);
                    }}
                    fetchSubAreas={fetchSubAreas}
                    isCreating={isCreatingSubArea}
                />
            )}
            
            {confirmationModal !== null && (
                <ModalAlert
                    title="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar el subárea? Todas las tareas asociadas serán eliminadas."
                    cancelText="Cancelar"
                    confirmText="Eliminar"
                    onCancel={() => setConfirmationModal(null)}
                    onConfirm={() => {
                        handleDeleteSubArea(confirmationModal)
                    }}
                />
            )}
        </div>
    );
}

export { SubAreasTab };