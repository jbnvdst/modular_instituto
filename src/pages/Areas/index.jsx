import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { ChevronDown, Plus, Users, FileText, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { NewTask } from '../../components/NewTask';
import { useAreas } from '../../utils/context/AreasContext';
import { useAuth } from '../../utils/context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Areas() {
  const [selectedArea, setSelectedArea] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assignedTo: '' });
  const { areas, loadingAreas } = useAreas();
  const { user } = useAuth();
  
  // Ajusta el filtro para usar ownerId
  const userAreas = areas.filter(area => area.ownerId === user?.id);

  // Obtén los datos del área seleccionada
  const areaData = userAreas.find(area => area.id === selectedArea);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const chartData = {
    labels: ['Tareas Urgentes', 'Tareas Normales', 'Tareas Completadas'],
    datasets: [{
      data: [8, 15, 32],
      backgroundColor: ['#ef444490', '#f59e0b70', '#10b98190'],
      borderWidth: 0
    }]
  };

  const barChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Tareas Completadas',
      data: [12, 15, 8, 20, 18, 6, 4],
      backgroundColor: '#10b98190',
      borderRadius: 4
    }]
  };

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        priority: newTask.priority,
        assignedBy: 'Usuario Actual',
        assignedTo: newTask.assignedTo,
        createdAt: new Date().toLocaleString()
      };
      setAreaData(prev => ({
        ...prev,
        tasks: [task, ...prev.tasks]
      }));
      setNewTask({ title: '', priority: 'medium', assignedTo: '' });
      setShowNewTaskModal(false);
    }
  };
  
  return (
    <Layout>
        <div className="bg-gray-50 w-full min-h-screen py-6">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-sm text-gray-500">Áreas</h1>
                </div>
            </div>

            <hr className="my-4 border-gray-200"/>

            {/* Selector de Área */}
            <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Área
            </label>
            <div className="relative">
                <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-64 flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-teal-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                <span className="text-gray-700">
                    {selectedArea ? userAreas.find(area => area.id === selectedArea)?.name : 'Seleccione un área'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {userAreas.length === 0 && (
                    <div className="px-4 py-3 text-gray-500">No tienes áreas asignadas como encargado.</div>
                    )}
                    {userAreas.map(area => (
                    <button
                        key={area.id}
                        onClick={() => {
                        setSelectedArea(area.id);
                        setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                        <div className="font-medium text-gray-900">{area.name}</div>
                        <div className="text-sm text-gray-500">{area.code}</div>
                    </button>
                    ))}
                </div>
                )}
            </div>
            </div>

            {selectedArea && (
            <>
                {/* Semáforos de Tareas */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tareas del Área</h3>
                    <button
                      onClick={() => setShowNewTaskModal(true)}
                      className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Tarea</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {areaData?.tasks?.length > 0 ? (
                      areaData.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <p className="text-sm text-gray-500">
                                Asignado por: {task.assignedBy} | Para: {task.assignedTo}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority === 'high' ? 'Urgente' : task.priority === 'medium' ? 'Normal' : 'Baja'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{task.createdAt}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No hay tareas en esta área.</div>
                    )}
                </div>
                </div>

                {/* Personal Asignado y Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Asignado */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Asignado</h3>
                    </div>
                    <div className="space-y-3">
                    {areaData?.staff?.length > 0 ? (
                      areaData.staff.map(person => (
                        <div key={person.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{person.name}</h4>
                            <p className="text-sm text-gray-500">{person.role}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              person.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No hay personal asignado a esta área.</div>
                    )}
                    </div>
                </div>

                {/* Gráficas */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tareas</h3>
                    <div className="h-48">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
                    <div className="h-48">
                        <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                    </div>
                </div>
                </div>
            </>
            )}

            Modal Nueva Tarea
            {showNewTaskModal && (
              <NewTask
                areaId={selectedArea}
                onClose={() => setShowNewTaskModal(false)}
                users={areaData.staff}
                // fetchTasks={fetchTasks} // si tienes una función para refrescar tareas
              />
            )}
        </div>
        </div>
    </Layout>
  );
}

export default Areas;