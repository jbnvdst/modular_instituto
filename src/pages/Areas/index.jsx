import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Bell, AlertCircle, CheckCircle, Clock, Activity, Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAreas } from '../../utils/context/AreasContext';
import { useAuth } from '../../utils/context/AuthContext';
import Layout from '../../components/Layout';
import { ToggleSwitch, NewTask, NewNote, ResolvedTask } from '../../components';
import { FaRegStickyNote } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Areas() {
  const { areas, loadingAreas } = useAreas();
  const { user, getDate } = useAuth();
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [personal, setPersonal] = useState([]);
  const [resolved, setResolved] = useState(false);
  const [resolvedTaskModal, setResolvedTaskModal] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const areaData = areas.find(area => area.id === selectedArea);

  useEffect(() => {
    if (user?.role !== 'admin' && areas.length > 0) {
      setSelectedArea(areas[0].id); // automáticamente selecciona la única área
    }
  }, [user, areas]);

  useEffect(() => {
    if (!selectedArea) return;
    const fetchPersonal = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-areas/getUsers/${selectedArea}`);
        const data = await res.json();
        setPersonal(data);
      } catch (error) {
        console.error("Error al obtener personal:", error);
      }
    };
    fetchPersonal();
  }, [selectedArea]);

  const chartData = {
    labels: ['Urgentes', 'Atención', 'Pendientes'],
    datasets: [
      {
        data: [4, 5, 6],
        backgroundColor: ['#ef444490', '#f59e0b70', '#10b98190'],
        borderWidth: 0
      }
    ]
  };

  const barChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Completadas',
        data: [1, 2, 1, 3, 1, 0, 2],
        backgroundColor: '#10b98190',
        borderRadius: 4
      }
    ]
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'rojo': return <AlertCircle className="w-4 h-4" />;
      case 'amarillo': return <Clock className="w-4 h-4" />;
      case 'verde': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };


  return (
    <Layout>
      <div className="bg-gray-50 w-full min-h-screen py-6">
        <div className="space-y-6">
          {/* Selector de Área */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user?.role === 'admin' ? 'Seleccionar Área' : 'Área Asignada'}
            </label>
            <div className="relative">
              {user?.role === 'admin' ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full md:w-64 flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-teal-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <span className="text-gray-700">
                    {selectedArea ? areas.find(area => area.id === selectedArea)?.name : 'Seleccione un área'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              ) : (
                <div className="w-full md:w-64 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  {areas[0]?.name ?? 'Sin área asignada'}
                </div>
              )}
              {isDropdownOpen && user?.role === 'admin' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {areas.map(area => (
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

          {/* Vista del Área */}
          {selectedArea && areaData && (
            <>
              {/* Panel de Lista de Tareas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tareas del Área</h3>
                </div>
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                  {resolved
                    ? areaData?.tasks?.filter(t => t.resolvedAt).map(task => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-lg flex justify-between hover:bg-gray-50">
                        <div className="flex space-x-3">
                          <div className="p-2 bg-gray-200 rounded-full">{getPriorityIcon(task.priority)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.subArea?.name} | {task.title}</h4>
                            <p className="text-sm text-gray-500">Resuelto por: {task.resolver?.name}</p>
                            <p className="text-sm text-gray-500">{task.comment || 'Sin comentario'}</p>
                          </div>
                        </div>
                        <div className="text-xs text-right text-gray-500">
                          <p>Creado {getDate(task.createdAt)}</p>
                          <p>Resuelto {getDate(task.resolvedAt)}</p>
                        </div>
                      </div>
                    ))
                    : areaData?.tasks?.filter(t => !t.resolvedAt).map(task => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-lg flex justify-between hover:bg-gray-50">
                        <div className="flex space-x-3">
                          <div className={`p-2 ${getPriorityColor(task.priority)} rounded-full`}>
                            {getPriorityIcon(task.priority)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.subArea?.name} | {task.title}</h4>
                            <p className="text-sm text-gray-500">Creado por: {task.creator?.name}</p>
                            <p className="text-sm text-gray-500">{task.description || 'Sin descripción'}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 space-y-1">
                          <p>Creado {getDate(task.createdAt)}</p>
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                              <Trash2 size={17} />
                            </button>
                            <button onClick={() => setResolvedTaskModal(task.id)} className="bg-teal-600/80 text-white px-2 py-1 rounded-full text-sm">
                              Resolver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="w-full flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg"
                  >
                    <Bell className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-sm font-medium text-teal-800">Crear Tarea</span>
                  </button>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="w-full flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg"
                  >
                    <FaRegStickyNote className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-sm font-medium text-teal-800">Crear Nota</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg">
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

              {/* Personal */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Asignado</h3>
                </div>
                <div className="space-y-3">
                  {personal?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody className="bg-white divide-y divide-gray-200">
                          {personal.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {u.areas[0].UserArea.role}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-500">No hay personal asignado.</div>
                  )}
                </div>
              </div>

              {/* Gráficas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* Modales */}
              {showNewTaskModal && <NewTask areaId={selectedArea} onClose={() => setShowNewTaskModal(false)} users={areaData.staff} />}
              {showNoteModal && <NewNote areaId={selectedArea} onClose={() => setShowNoteModal(false)} users={areaData.staff} />}
              {resolvedTaskModal && <ResolvedTask taskId={resolvedTaskModal} onClose={() => setResolvedTaskModal(false)} />}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Areas;
