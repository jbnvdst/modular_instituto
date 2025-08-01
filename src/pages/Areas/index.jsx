import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Users, Bell, AlertCircle, CheckCircle, Clock, Activity, Trash2} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAreas } from '../../utils/context/AreasContext';
import { useAuth } from '../../utils/context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { NewTask, ResolvedTask, ToggleSwitch, NewNote } from '../../components';
import Layout from '../../components/Layout';
import { FaRegStickyNote } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Areas() {
  const { id } = useParams();
  const [selectedArea, setSelectedArea] = useState(id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [ showNoteModal, setShowNoteModal ] = useState(false);
  const [resolvedTaskModal, setResolvedTaskModal] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assignedTo: '' });
  const { areas, loadingAreas } = useAreas();
  const [ personal, setPersonal ] = useState([]);
  const { user, getDate, userArea } = useAuth();
  const [ resolved, setResolved] = useState(false);
  const [ userAreas, setUserAreas ] = useState([]);
  const areaData = userAreas.find(area => area.id === selectedArea);
  const [tasksCount, setTasksCount] = useState({ urgent: 0, attention: 0, pending: 0 });

  // IMPORTANTE: ahora days es un objeto con labels y datasets
  const [days, setDays] = useState({ labels: [], datasets: [] });
  
  useEffect(() => {
    setUserAreas(areas.filter(area => area.id === userArea));
    fetchPersonal();

    // Calcular tareas pendientes
    setTasksCount(userAreas.filter(area => area.id === selectedArea).reduce((acc, area) => {
      area.tasks.forEach(task => {
        if (!task.resolvedAt) {
          if (task.priority === 'rojo') {
            acc.urgent += 1;
          } else if (task.priority === 'amarillo') {
            acc.attention += 1;
          } else if (task.priority === 'verde') {
            acc.pending += 1;
          }
        }
      });
      return acc;
    }, { urgent: 0, attention: 0, pending: 0 }));

    // === NUEVO CÓDIGO: últimos 7 días reales, tareas creadas, clasificadas por prioridad ===
    const hoy = new Date();
    const ultimos7 = [];
    for (let i = 6; i >= 0; i--) {
      const f = new Date(hoy);
      f.setDate(hoy.getDate() - i);
      ultimos7.push({
        date: f,
        label: f.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })
      });
    }

    const tareas = userAreas
      .filter(area => area.id === selectedArea)
      .flatMap(area => area.tasks);

    const priorityMap = {
      rojo: "Urgente",
      amarillo: "Atención",
      verde: "Pendiente",
    };

    // Inicializa estructura
    const counts = {
      Urgente: Array(7).fill(0),
      Atención: Array(7).fill(0),
      Pendiente: Array(7).fill(0),
    };

    ultimos7.forEach((dia, index) => {
      const tareasDelDia = tareas.filter((task) => {
        const fecha = new Date(task.createdAt);
        return (
          fecha.getFullYear() === dia.date.getFullYear() &&
          fecha.getMonth() === dia.date.getMonth() &&
          fecha.getDate() === dia.date.getDate()
        );
      });

      tareasDelDia.forEach((task) => {
        const tipo = priorityMap[task.priority];
        counts[tipo][index]++;
      });
    });

    setDays({
      labels: ultimos7.map((d) => d.label),
      datasets: [
        {
          label: "Urgente",
          data: counts.Urgente,
          backgroundColor: "#ff000070",
          borderColor: "#fff",
          borderWidth: 1,
        },
        {
          label: "Atención",
          data: counts.Atención,
          backgroundColor: "#F59E0B70",
          borderColor: "#fff",
          borderWidth: 1,
        },
        {
          label: "Pendiente",
          data: counts.Pendiente,
          backgroundColor: "#16A34A70",
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });

  }, [selectedArea, areas]);

  
  useEffect(() => {
    if(userAreas?.length === 1) {
      setSelectedArea(userAreas[0]?.id);
    }
  }, [userAreas]);


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'rojo': return 'text-red-600 bg-red-100';
      case 'amarillo': return 'text-yellow-600 bg-yellow-100';
      case 'verde': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'rojo': return <AlertCircle className="w-4 h-4" />;
      case 'amarillo': return <Clock className="w-4 h-4" />;
      case 'verde': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

   const fetchPersonal = async () => {
        if (!selectedArea) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas/getUsers/${selectedArea}`);
            setPersonal(response.data);
        } catch (error) {
            console.error("Error fetching personal in area:", error);
        }
    };

  const chartData = {
    labels: ['Urgentes', 'Atención', 'Pendientes'],
    datasets: [{
      data: [tasksCount.urgent, tasksCount.attention, tasksCount.pending],
      backgroundColor: ['#ef444490', '#f59e0b70', '#10b98190'],
      borderWidth: 0
    }]
  };

  const handleDeleteTask = async (taskId) => {
    if (!selectedArea || !taskId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`);
      setUserAreas(prev =>
        prev.map(area =>
          area.id === selectedArea
            ? { ...area, tasks: area.tasks.filter(task => task.id !== taskId) }
            : area
        )
      );
    } catch (error) {
      console.error("Error al borrar la tarea:", error);
      alert("No se pudo borrar la tarea.");
    }
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 onClick={() => console.log(userAreas)} className="text-sm text-gray-500">Áreas</h1>
                </div>
            </div>

            <hr className="my-4 border-gray-200"/>

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
                    {userAreas.length === 1 && (
                      <div onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 text-gray-500">Solo tienes un área asignada: {userAreas[0].name}</div>
                    )}
                    {userAreas.length > 1 &&userAreas.map(area => (
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
                <div className='grid grid-cols-[70%_1fr] gap-6'>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 onClick={() => console.log(areaData.tasks)} className="text-lg font-semibold text-gray-900">Tareas del Área</h3>
                    </div>
                    <div className="mt-4 block text-sm text-gray-700">
                          {resolved ? (
                            <div className="flex flex-col max-h-92 gap-1.5 overflow-y-auto scrollbar-hide">
                              {areaData?.tasks?.filter(task => task.resolvedAt !== null).length > 0 ? (
                                areaData.tasks
                                  .filter(task => task.resolvedAt !== null)
                                  .map(task => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full bg-gray-200`}>
                                          {getPriorityIcon(task.priority)}
                                        </div>
                                        <div>
                                          <h4
                                            onClick={() => console.log(task)}
                                            className="font-medium text-gray-900"
                                          >
                                            <b>{task.subArea.name}</b> | {task.title}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                            Resuelto por: {task.resolver.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {task.comment ? `Comentario: ${task.comment}` : 'Sin comentario'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-500 mt-1">
                                          Creado {getDate(task.createdAt)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Resuelto {getDate(task.resolvedAt)}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <div className="text-gray-500">No hay tareas resueltas en esta área.</div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col max-h-92 gap-1.5 overflow-y-auto scrollbar-hide">
                              {areaData?.tasks?.filter(task => task.resolvedAt === null).length > 0 ? (
                                areaData.tasks
                                  .filter(task => task.resolvedAt === null)
                                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                  .map(task => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${getPriorityColor(task.priority)}`}>
                                          {getPriorityIcon(task.priority)}
                                        </div>
                                        <div>
                                          <h4
                                            onClick={() => console.log(task)}
                                            className="font-medium text-gray-900"
                                          ><b>{task.subArea?.name}</b> | {task.title}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                            Creado por: {task.creator.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {task.description && `Descripción: ${task.description}`}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-2">
                                          Creado {getDate(task.createdAt)}
                                        </p>
                                        <div className='flex justify-end'>
                                          <div onClick={() => handleDeleteTask(task.id)} className='flex justify-center items-center px-2 text-red-600 cursor-pointer'>
                                            <Trash2 size={17}/>
                                          </div>
                                          <span
                                            onClick={() => setResolvedTaskModal(task.id)}
                                            className="cursor-pointer inline-flex px-2 py-1 text-sm text-white font-medium rounded-full bg-teal-600/80"
                                          >
                                            Resolver
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <div className="text-gray-500">No hay tareas pendientes en esta área.</div>
                              )}
                            </div>
                          )}
                        </div>
                    
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                      <div className="space-y-3">
                          <button onClick={() => setShowNewTaskModal(true)}  
                              className="w-full cursor-pointer flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                              >
                              <Bell className="w-5 h-5 text-teal-600 mr-3" />
                              <span className="text-sm font-medium text-teal-800">Crear Tarea</span>
                          </button>
                          <button onClick={() => (setShowNoteModal(true))}  
                              className="w-full cursor-pointer flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                              >
                              <FaRegStickyNote className="w-5 h-5 text-teal-600 mr-3" />
                              <span className="text-sm font-medium text-teal-800">Crear Nota</span>
                          </button>
                          <button className="w-full flex cursor-pointer items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                              <Activity className="w-5 h-5 text-gray-600 mr-3" />
                              <span className="text-sm font-medium text-gray-700">Descargar Reporte</span>
                          </button>
                          <ToggleSwitch
                            word1="Sin Resolver"
                            word2="Resueltas"
                            value={resolved}
                            onChange={setResolved}
                          />
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-teal-600" />
                    <h3 onClick={() => console.log(personal)} className="text-lg font-semibold text-gray-900">Personal Asignado</h3>
                    </div>
                    <div className="space-y-3">
                    {personal?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {personal.map((user) => (
                                      <tr key={user.id} className="hover:bg-gray-50">
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <div>
                                                  <div onClick={() => console.log(user)} className="text-sm font-medium text-gray-900">{user.name}</div>                                                  
                                              </div>
                                          </td>                                          
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.areas[0].UserArea.role}</td>                                                                  
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    ) : (
                      <div className="text-gray-500">No hay personal asignado a esta área.</div>
                    )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tareas</h3>
                    <div className="h-48">
                      {areaData && areaData.tasks.length > 0 ? <Doughnut data={chartData} options={{ maintainAspectRatio: false }} /> : "No hay datos que graficar"}
                    </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
                    <div className="h-48">
                        {(areaData && days.datasets.length > 0 && days.datasets.some(ds => ds.data.some(v => v > 0))) ?
                          <Bar 
                            data={days}
                            options={{
                              maintainAspectRatio: false,
                              responsive: true,
                              plugins: {
                                legend: { display: false },
                              },
                              scales: {
                                x: { stacked: true },
                                y: {
                                  stacked: true,
                                  beginAtZero: true,
                                  ticks: {
                                    callback: (value) =>
                                      Number.isInteger(value) ? value : "",
                                  },
                                },
                              },
                            }}
                          /> : "No hay datos que graficar"}
                    </div>
                    </div>
                </div>
                </div>
            </>
            )}
            {showNewTaskModal && (
              <NewTask
                areaId={selectedArea}
                onClose={() => setShowNewTaskModal(false)}
                users={areaData.staff}
              />
            )}
            {showNoteModal && (
              <NewNote
                areaId={selectedArea}
                onClose={() => setShowNoteModal(false)}
                users={areaData.staff}
              />
            )}
            {resolvedTaskModal && (
              <ResolvedTask
                taskId={resolvedTaskModal}
                onClose={() => setResolvedTaskModal(false)}
              />
            )}
        </div>
        </div>
    </Layout>
  );
}

export default Areas;
