import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Users, Bell, AlertCircle, CheckCircle, Clock, Activity, Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAreas } from '../../utils/context/AreasContext';
import { useAuth } from '../../utils/context/AuthContext';
import { useParams } from 'react-router-dom';
import { FaRegStickyNote } from "react-icons/fa";
import { FaFileArrowDown } from "react-icons/fa6";
import axios from 'axios';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { NewTask, ResolvedTask, ToggleSwitch, NewNote, RequestsList } from '../../components';
import { BiSolidBookContent } from "react-icons/bi";
import Layout from '../../components/Layout';
import { NewRequest } from '../../components/NewRequest';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Areas() {
  const { id } = useParams();
  const [selectedArea, setSelectedArea] = useState(id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [resolvedTaskModal, setResolvedTaskModal] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assignedTo: '' });
  const { areas, loadingAreas } = useAreas();
  const [personal, setPersonal] = useState([]);
  const { user, getDate, userArea, notes, fetchNotes, getRoleFromToken } = useAuth();
  const [resolved, setResolved] = useState(false);
  const [userAreas, setUserAreas] = useState([]);
  const areaData = userAreas.find(area => area.id === selectedArea);
  const [tasksCount, setTasksCount] = useState({ urgent: 0, attention: 0, pending: 0 });
  const [days, setDays] = useState({ labels: [], datasets: [] });

  // Estado para el tab de subárea seleccionado
  const [selectedSubArea, setSelectedSubArea] = useState("all");

  // Función mejorada para obtener subáreas únicas
  const getUniqueSubAreas = () => {
    if (!areaData?.tasks) return [];
    const subAreas = new Set();
    areaData.tasks.forEach(task => {
      if (task.subArea?.name) {
        subAreas.add(task.subArea.name);
      }
    });

    const knownSubAreas = [
      'Servicios Generales',
      'Biomedica',
      'Insumos',
      'Estructura',
      'Recurso Humano',
      'Sistemas'
    ];

    const foundSubAreas = Array.from(subAreas);
    const orderedKnown = knownSubAreas.filter(sa => foundSubAreas.includes(sa));
    const newSubAreas = foundSubAreas.filter(sa => !knownSubAreas.includes(sa));

    return [...orderedKnown, ...newSubAreas.sort()];
  };

  const uniqueSubAreas = getUniqueSubAreas();

  // Función para filtrar tareas por subárea y estatus resuelto
  const getFilteredTasks = () => {
    if (!areaData?.tasks) return [];

    let filtered = areaData.tasks.filter(task =>
      resolved ? task.resolvedAt !== null : task.resolvedAt === null
    );

    if (selectedSubArea !== "all") {
      filtered = filtered.filter(task => task.subArea?.name === selectedSubArea);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Función para contar tareas por subárea (para las chips de tabs)
  const getTaskCountBySubArea = (subAreaName) => {
    if (!areaData?.tasks) return 0;
    return areaData.tasks.filter(task => {
      const matchesResolved = resolved ? task.resolvedAt !== null : task.resolvedAt === null;
      const matchesSubArea = subAreaName === "all" ? true : task.subArea?.name === subAreaName;
      return matchesResolved && matchesSubArea;
    }).length;
  };

  useEffect(() => {
    if (selectedArea) {
      fetchNotes(selectedArea);
      fetchPersonal();
    }
  }, [selectedArea]);

  const role = getRoleFromToken();

  useEffect(() => {
    // Áreas del usuario (encargado de X área)
    setUserAreas(areas.filter(area => area.id === userArea));

    // Contador de tareas por prioridad para la dona
    const counts = areas
      .filter(area => area.id === selectedArea)
      .reduce((acc, area) => {
        (area.tasks || []).forEach(task => {
          if (!task.resolvedAt) {
            if (task.priority === 'rojo') acc.urgent += 1;
            else if (task.priority === 'amarillo') acc.attention += 1;
            else if (task.priority === 'verde') acc.pending += 1;
          }
        });
        return acc;
      }, { urgent: 0, attention: 0, pending: 0 });

    setTasksCount(counts);

    // Datos de los últimos 7 días para la barra apilada
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

    const tareas = areas
      .filter(area => area.id === selectedArea)
      .flatMap(area => area.tasks || []);

    const priorityMap = {
      rojo: "Urgente",
      amarillo: "Atención",
      verde: "Pendiente",
    };

    const weekly = {
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
        if (tipo) weekly[tipo][index]++;
      });
    });

    setDays({
      labels: ultimos7.map((d) => d.label),
      datasets: [
        {
          label: "Urgente",
          data: weekly.Urgente,
          backgroundColor: "#ff000070",
          borderColor: "#fff",
          borderWidth: 1,
        },
        {
          label: "Atención",
          data: weekly.Atención,
          backgroundColor: "#F59E0B70",
          borderColor: "#fff",
          borderWidth: 1,
        },
        {
          label: "Pendiente",
          data: weekly.Pendiente,
          backgroundColor: "#16A34A70",
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });
  }, [selectedArea, areas, userArea]);

  // Reset tab cuando cambia resolved o selectedArea
  useEffect(() => {
    setSelectedSubArea("all");
  }, [resolved, selectedArea]);

  const handleDownloadReport = async () => {
    if (!areaData || !areaData.tasks) return;

    const tareasPendientes = areaData.tasks.filter((t) => !t.resolvedAt);
    const tareasResueltas = areaData.tasks.filter((t) => t.resolvedAt);

    const prioridadOrden = { verde: 1, amarillo: 2, rojo: 3 };
    const sortByPriorityAndDate = (a, b) => {
      const pa = prioridadOrden[a.priority];
      const pb = prioridadOrden[b.priority];
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt) - new Date(a.createdAt);
    };

    const pendientesOrdenadas = [...tareasPendientes].sort(sortByPriorityAndDate);
    const resueltasOrdenadas = [...tareasResueltas].sort(sortByPriorityAndDate);

    const workbook = new ExcelJS.Workbook();

    const crearHoja = (nombre, datos, isResolved = false) => {
      const ws = workbook.addWorksheet(nombre);

      ws.columns = [
        { header: "Título", key: "title", width: 40 },
        { header: "Prioridad", key: "priority", width: 15 },
        { header: "Subárea", key: "subarea", width: 25 },
        { header: "Creado por", key: "creator", width: 20 },
        { header: "Fecha de creación", key: "created", width: 20 },
        ...(isResolved
          ? [
            { header: "Fecha de resolución", key: "resolved", width: 20 },
            { header: "Resuelto por", key: "resolvedBy", width: 25 },
          ]
          : []),
      ];

      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "000000" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E0E0E0" },
        };
      });

      const getPriorityFill = (priority) => {
        if (isResolved) return "D9D9D9";
        switch (priority) {
          case "rojo": return "F4CCCC";
          case "amarillo": return "FFF2CC";
          case "verde": return "93C47D";
          default: return "FFFFFF";
        }
      };

      datos.forEach((task) => {
        const rowData = [
          task.title,
          task.priority === "rojo" ? "Urgente" : task.priority === "amarillo" ? "Atención" : "Pendiente",
          task.subArea?.name || "",
          task.creator?.name || "",
          new Date(task.createdAt).toLocaleString(),
        ];

        if (isResolved) {
          rowData.push(
            new Date(task.resolvedAt).toLocaleString(),
            task.resolver?.name || ""
          );
        }

        const row = ws.addRow(rowData);

        const priorityCell = row.getCell(2);
        priorityCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: getPriorityFill(task.priority) },
        };
        priorityCell.font = {
          color: { argb: "000000" },
          bold: true,
        };
      });
    };

    crearHoja("Pendientes", pendientesOrdenadas, false);
    crearHoja("Resueltas", resueltasOrdenadas, true);

    const buffer = await workbook.xlsx.writeBuffer();
    const fechaHoy = new Date()
      .toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
      .replace(/\//g, "-");

    saveAs(new Blob([buffer]), `Reporte_${areaData.name || 'Area'}_${fechaHoy}.xlsx`);
  };

  useEffect(() => {
    if (userAreas?.length === 1) {
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
      case 'rojo': return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'amarillo': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'verde': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
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
            ? { ...area, tasks: (area.tasks || []).filter(task => task.id !== taskId) }
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
        createdAt: new Date().toISOString(),
        resolvedAt: null
      };
      // Actualiza en userAreas (no existe setAreaData)
      setUserAreas(prev =>
        prev.map(area =>
          area.id === selectedArea
            ? { ...area, tasks: [task, ...(area.tasks || [])] }
            : area
        )
      );
      setNewTask({ title: '', priority: 'medium', assignedTo: '' });
      setShowNewTaskModal(false);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Layout>
      <div className="bg-gray-50 w-full min-h-screen py-3 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xs sm:text-sm text-gray-500">Áreas</h1>
            </div>
          </div>

          <hr className="my-3 sm:my-4 border-gray-200" />

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Seleccionar Área
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full lg:w-64 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg hover:border-teal-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <span className="text-gray-700 text-sm sm:text-base truncate">
                  {selectedArea ? userAreas.find(area => area.id === selectedArea)?.name : 'Seleccione un área'}
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {userAreas.length === 0 && (
                    <div className="px-3 sm:px-4 py-3 text-gray-500 text-xs sm:text-sm">No tienes áreas asignadas como encargado.</div>
                  )}
                  {userAreas.length === 1 && (
                    <div onClick={() => setIsDropdownOpen(false)} className="px-3 sm:px-4 py-3 text-gray-500 text-xs sm:text-sm">
                      Solo tienes un área asignada: {userAreas[0].name}
                    </div>
                  )}
                  {userAreas.length > 1 && userAreas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => {
                        setSelectedArea(area.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{area.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{area.code}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedArea && (
            <>
              <div className='grid grid-cols-1 xl:grid-cols-[70%_1fr] gap-4 sm:gap-6'>
                <div className="bg-white rounded-lg shadow-sm order-2 xl:order-1">
                  {/* Tabs de SubÁreas */}
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-1 px-4 pt-4 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                      {/* Tab "Todas" */}
                      <button
                        onClick={() => setSelectedSubArea("all")}
                        className={`
                          whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors
                          ${selectedSubArea === "all"
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        Todas
                        <span className={`ml-1 sm:ml-2 inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 text-xs font-bold rounded-full
                          ${selectedSubArea === "all" ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}`}>
                          {getTaskCountBySubArea("all")}
                        </span>
                      </button>

                      {/* Tabs dinámicos por SubÁrea */}
                      {uniqueSubAreas.map(subArea => (
                        <button
                          key={subArea}
                          onClick={() => setSelectedSubArea(subArea)}
                          className={`
                            whitespace-nowrap py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors
                            ${selectedSubArea === subArea
                              ? 'border-teal-500 text-teal-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                          `}
                        >
                          {subArea}
                          <span className={`ml-1 sm:ml-2 inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 text-xs font-bold rounded-full
                            ${selectedSubArea === subArea ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}`}>
                            {getTaskCountBySubArea(subArea)}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Contenido de tareas con filtrado */}
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Tareas del Área
                        {selectedSubArea !== "all" && ` - ${selectedSubArea}`}
                      </h3>
                    </div>

                    <div className="mt-4 block text-xs sm:text-sm text-gray-700">
                      <div className="flex flex-col max-h-[400px] sm:max-h-92 gap-1.5 overflow-y-auto scrollbar-hide">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map(task => (
                            <div
                              key={task.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 gap-2"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className={`p-1.5 sm:p-2 rounded-full ${resolved ? 'bg-gray-200' : getPriorityColor(task.priority)}`}>
                                  {getPriorityIcon(task.priority)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                    <b className="text-teal-600">{task.subArea?.name}</b> | {task.title}
                                  </h4>

                                  {resolved ? (
                                    <>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        Resuelto por: {task.resolver?.name}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        {task.comment ? `Comentario: ${task.comment}` : 'Sin comentario'}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        Creado por: {task.creator?.name}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        {task.description && `Descripción: ${task.description}`}
                                      </p>
                                      {
                                        task.file && (
                                          <a href={task.file} target='_blank' className="text-xs sm:text-sm text-gray-500 mt-1">
                                            <div className='flex items-center gap-1 text-teal-600 font-semibold'>
                                              <FaFileArrowDown size={20}/>
                                              Ver archivo adjunto {task.file.name}
                                            </div>
                                          </a>
                                        )
                                      }
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className={resolved ? "text-right ml-8 sm:ml-0" : "flex sm:block items-center gap-2 ml-8 sm:ml-0"}>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                  Creado {getDate(task.createdAt)}
                                </p>

                                {resolved ? (
                                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                    Resuelto {getDate(task.resolvedAt)}
                                  </p>
                                ) : (
                                  <>
                                    {role !== 'medico' && (
                                      <div className='flex justify-end gap-1'>
                                        <div
                                          onClick={() => handleDeleteTask(task.id)}
                                          className='flex justify-center items-center p-1 sm:px-2 text-red-600 cursor-pointer hover:bg-red-50 rounded'
                                        >
                                          <Trash2 size={15} className="sm:w-[17px]" />
                                        </div>
                                        <span
                                          onClick={() => setResolvedTaskModal(task.id)}
                                          className="cursor-pointer inline-flex px-2 py-1 text-xs sm:text-sm text-white font-medium rounded-full bg-teal-600/80"
                                        >
                                          Resolver
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-4">
                            No hay tareas {resolved ? 'resueltas' : 'pendientes'}
                            {selectedSubArea !== "all" && ` en ${selectedSubArea}`}.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 order-1 xl:order-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Acciones Rápidas</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <button onClick={() => setShowNewTaskModal(true)}
                      className="w-full cursor-pointer flex items-center p-2.5 sm:p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mr-3" />
                      <span className="text-xs sm:text-sm font-medium text-teal-800">Crear Tarea</span>
                    </button>
                    <button onClick={() => (setShowNoteModal(true))}
                      className="w-full cursor-pointer flex items-center p-2.5 sm:p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <FaRegStickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mr-3" />
                      <span className="text-xs sm:text-sm font-medium text-teal-800">Crear Nota</span>
                    </button>
                    <button onClick={() => (setShowRequestModal(true))}
                      className="w-full cursor-pointer flex items-center p-2.5 sm:p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <FaRegStickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mr-3" />
                      <span className="text-xs sm:text-sm font-medium text-teal-800">Crear Solicitud</span>
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      className="w-full flex cursor-pointer items-center p-2.5 sm:p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-3" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Descargar Reporte</span>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <FaRegStickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notas del Área</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-hide">
                    {notes.length > 0 ? (
                      [...notes]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 5)
                        .map((nota) => (
                          <div
                            key={nota.id}
                            className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-900 font-semibold text-xs sm:text-sm">
                                  {nota.title} |{" "}
                                  <span className="text-green-600 font-medium">
                                    {nota.status}
                                  </span>
                                </h4>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                  Creado por: {nota.creator?.name || nota.createdBy}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500">
                                  Descripción: {nota.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500 text-sm">No hay notas para esta área.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <BiSolidBookContent className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Solicitudes</h3>
                  </div>
                  <RequestsList />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Asignado</h3>
                  </div>
                  <div className="space-y-3">
                    {personal?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <tbody className="bg-white divide-y divide-gray-200">
                            {personal.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                  {user.areas[0].UserArea.role}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No hay personal asignado a esta área.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Distribución de Tareas</h3>
                    <div className="h-40 sm:h-48">
                      {areaData && (areaData.tasks?.length > 0) ?
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} /> :
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">No hay datos que graficar</div>
                      }
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Actividad Semanal</h3>
                    <div className="h-40 sm:h-48">
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
                                  callback: (value) => Number.isInteger(value) ? value : "",
                                },
                              },
                            },
                          }}
                        /> :
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">No hay datos que graficar</div>
                      }
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
              users={areaData?.staff || []}
            />
          )}
          {showNoteModal && (
            <NewNote
              areaId={selectedArea}
              onClose={() => setShowNoteModal(false)}
              onSave={async (values) => {
                const payload = {
                  title: values.nombre,
                  doc_title: values.numeroOficio,
                  description: values.descripcion,
                  status: values.estatus.charAt(0).toUpperCase() + values.estatus.slice(1),
                  areaId: userArea,
                  involvedArea: selectedArea,
                  createdBy: user.id
                };
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/notes`, payload);
                fetchNotes(selectedArea);
              }}
            />
          )}
          {showRequestModal && (
            <NewRequest
              areaId={selectedArea}
              onClose={() => setShowRequestModal(false)}
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
