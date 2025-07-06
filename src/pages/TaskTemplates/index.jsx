import React, { useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import Layout from "../../components/Layout";
import { FaPlus } from "react-icons/fa6";
import { NewTemplate } from "../../components/NewTemplate";
import { ModalAlert } from "../../components/ModalAlert";
import axios from "axios";

const TaskTemplates = () => {
  const { taskTemplates, fetchTemplates } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(null);

//   React.useEffect(() => {
//     fetchTemplates();
//   }, [fetchTemplates]);

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
        <div className="bg-gray-50 w-full min-h-screen py-6">
            <div className="space-y-6 w-full">
                <div className="flex justify-between items-center">
                    <h1 onClick={() => console.log(taskTemplates)} className="text-sm text-gray-500">Mis plantillas</h1>
                    <button onClick={() => setSelectedTemplate('new')} className="flex gap-2 items-center px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition duration-200">
                        <FaPlus />
                        <span className="ml-2">Nueva plantilla</span>
                    </button>
                </div>
                <hr className="my-4 border-gray-200"/>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {taskTemplates.length > 0 ? taskTemplates.map((template) => (
                    <div key={template.id} className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 w-full max-w-[400px] ${template.priority === 'rojo' ? 'border-red-400' : template.priority === 'amarillo' ? 'border-yellow-400' : 'border-teal-500'}`}>
                        <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                        <p className="text-gray-600">{template.description}</p>
                        <div className="flex items-center w-full justify-between">
                            <p className="text-gray-500 text-sm">Prioridad: {template.priority}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedTemplate(template)} className="px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">Editar</button>
                                <button onClick={() => setShowModal(template.id)} className="px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-red-500 duration-200">Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))
                :
                (
                    <div className="col-span-3 text-center p-4 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">No tienes plantillas de tareas disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    </Layout>
  );
}

export default TaskTemplates;