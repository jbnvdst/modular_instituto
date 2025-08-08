import React, { useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import { NewTemplate, ModalAlert } from '../../components';
import Layout from "../../components/Layout";
import axios from "axios";

const TaskTemplates = () => {
  const { taskTemplates, fetchTemplates } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const handleDeleteTemplate = async (templateId) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/task-template/${templateId}`);
        if (response.status === 200) {
            await fetchTemplates();
            setShowModal(null);
            setSelectedTemplate(null);
        }
    } catch (error) {
        console.error("Error al eliminar la plantilla:", error);
        alert("Error al eliminar la plantilla. Por favor, inténtalo de nuevo.");
    }
  }

  return (
    <Layout>
        {selectedTemplate !== null &&
            <NewTemplate template={selectedTemplate} onClose={() => setSelectedTemplate(null)}/>
        }
        {showModal && (
            <ModalAlert
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar la plantilla?"
                cancelText="Cancelar"
                confirmText="Eliminar"
                onCancel={() => setShowModal(null)}
                onConfirm={() => {
                    handleDeleteTemplate(showModal)
                }}
            />
        )}
        <div className="bg-gray-50 w-full min-h-screen py-3 sm:py-6">
            <div className="space-y-4 sm:space-y-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h1 onClick={() => console.log(taskTemplates)} className="text-xs sm:text-sm text-gray-500">
                        Mis plantillas
                    </h1>
                    <button 
                        onClick={() => setSelectedTemplate('new')} 
                        className="flex gap-2 items-center px-3 sm:px-4 py-2 
                                 bg-teal-500 text-white rounded-lg cursor-pointer 
                                 hover:bg-teal-600 transition duration-200
                                 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Nueva plantilla</span>
                    </button>
                </div>
                <hr className="my-3 sm:my-4 border-gray-200"/>
            </div>
            
            {/* Grid responsive de plantillas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full mt-4">
                {taskTemplates.length > 0 ? taskTemplates.map((template) => (
                    <div 
                        key={template.id} 
                        className={`flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 
                                  bg-white rounded-lg shadow-md border-l-4 w-full
                                  ${template.priority === 'rojo' ? 'border-red-400' : 
                                    template.priority === 'amarillo' ? 'border-yellow-400' : 
                                    'border-teal-500'}`}
                    >
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                            {template.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                            {template.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-2">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Prioridad: 
                                <span className={`ml-1 font-medium
                                    ${template.priority === 'rojo' ? 'text-red-600' : 
                                      template.priority === 'amarillo' ? 'text-yellow-600' : 
                                      'text-green-600'}`}>
                                    {template.priority === 'rojo' ? 'Urgente' : 
                                     template.priority === 'amarillo' ? 'Atención' : 
                                     'Pendiente'}
                                </span>
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => setSelectedTemplate(template)} 
                                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-1 
                                             border-2 rounded-full text-xs sm:text-sm font-semibold 
                                             cursor-pointer hover:bg-gray-200 hover:text-teal-500 
                                             duration-200 text-center"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => setShowModal(template.id)} 
                                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-1 
                                             border-2 rounded-full text-xs sm:text-sm font-semibold 
                                             cursor-pointer hover:bg-gray-200 hover:text-red-500 
                                             duration-200 text-center"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                :
                (
                    <div className="col-span-full text-center p-6 sm:p-8 bg-white rounded-lg shadow-md">
                        <p className="text-sm sm:text-base text-gray-500">
                            No tienes plantillas de tareas disponibles.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </Layout>
  );
}

export default TaskTemplates;