import React, { useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import Layout from "../../components/Layout";
import { FaPlus } from "react-icons/fa6";
import { Edit2, Trash2 } from "lucide-react";
import { ModalAlert } from "../../components/ModalAlert";
import axios from "axios";
import { NewRecurringTask } from "../../components/NewRecurringTask";

const RecurringTasks = () => {
    const { recurringTasks, fetchRecurringTasks } = useAuth();
    const [selectedTask, setSelectedTask] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    
    // React.useEffect(() => {
    //     fetchRecurringTasks();
    // }, [fetchRecurringTasks]);
    const getFrequencyName = (frequency) => {
        switch (frequency) {
            case 'daily':
                return 'día(s)';
            case 'weekly':
                return 'semana(s)';
            case 'monthly':
                return 'mes(es)';
        }
    }

    const handleDeleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/recurring-tasks/${taskId}`);
        if (response.status === 200) {
            await fetchRecurringTasks();
            setConfirmationModal(null);
            setSelectedTask(null);
        }
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        alert("Error al eliminar la tarea. Por favor, inténtalo de nuevo.");
    }
  }
    
    return (
        <Layout>
            {selectedTask !== null &&
                <NewRecurringTask task={selectedTask} onClose={() => setSelectedTask(null)}/>
            }
            {confirmationModal && (
                <ModalAlert
                    title="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar la tarea recurrente?"
                    cancelText="Cancelar"
                    confirmText="Eliminar"
                    onCancel={() => setConfirmationModal(null)}
                    onConfirm={() => {
                        handleDeleteTask(confirmationModal);
                    }}
                />
            )}
            <div className="bg-gray-50 w-full min-h-screen py-6">
                <div className="space-y-6 w-full">
                    <div className="flex justify-between items-center">
                        <h1 onClick={() => console.log(recurringTasks)} className="text-sm text-gray-500">Mis tareas</h1>
                        <button onClick={() => setSelectedTask('new')} className="flex gap-2 items-center px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition duration-200">
                            <FaPlus />
                            <span className="ml-2">Nueva plantilla</span>
                        </button>
                    </div>
                    <hr className="my-4 border-gray-200"/>
                </div>
                {recurringTasks.length > 0 ? <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Necesidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">última ejecución</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recurringTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            task.priority === 'verde' 
                                                ? 'bg-green-100 text-teal-500'
                                                : task.priority === 'amarillo' ? 'bg-yellow-100 text-yellow-400'
                                                : 'bg-red-100 text-red-400'
                                        }`}>
                                            {task.priority === 'rojo' ? 'Urgente' : task.priority === 'amarillo' ? 'En atención' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.area.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.subArea.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cada {task.interval} {getFrequencyName(task.frequency)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(task.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.endDate ? new Date(task.endDate).toLocaleDateString() : 'Indefinido'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.lastExecuted ? new Date(task.lastExecuted).toLocaleDateString() : 'Nunca'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button onClick={() => setSelectedTask(task)} className="text-blue-600 cursor-pointer hover:text-blue-800">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => setConfirmationModal(task.id)} className="text-red-600 cursor-pointer hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                :
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No tienes tareas recurrentes disponibles.</p>
                </div>
                }
            </div>
        </Layout>
    );
}

export default RecurringTasks;