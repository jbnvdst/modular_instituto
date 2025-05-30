import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { CountingCard } from "../../components/CountingCard";
import { NavLink } from "react-router-dom";
import { PiNotificationDuotone, PiSirenDuotone } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import { PiUsersThreeFill } from "react-icons/pi";
import { BiSolidReport } from "react-icons/bi";
import { lastNotifications } from "../../utils/data/lastNotifications";
import * as Chart from "chart.js/auto";
import { areas } from "../../utils/data/areas";


    function getEmailFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload del token:", payload); // <-- Agrega esto
            return payload.email || null;
        } catch {
            return null;
        }
    }

    function getIdFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || null;
        } catch {
            return null;
        }
    }

const Home = () => {
    const [nombre, setNombre] = useState("");
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const lineChartRef = useRef(null);
    const lineChartInstance = useRef(null);

    
    useEffect(() => {
        const id = getIdFromToken();
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get/`)
            .then(res => {
                const usuario = res.data.find(
                    u => u.id === id
                );
                setNombre(usuario ? usuario.name : "Usuario");
            })
            .catch(() => setNombre("Usuario"));
    }, []);

    useEffect(() => {
        Chart.Chart.register(
        Chart.CategoryScale,
        Chart.LinearScale,
        Chart.BarElement,
        Chart.LineElement,
        Chart.PointElement, 
        Chart.Title,
        Chart.Tooltip,
        Chart.Legend
        );
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        // Destruir gráfica anterior si existe
        if (chartInstance.current) {
        chartInstance.current.destroy();
        }

        // Procesar datos
        const processedData = areas.map(area => {
        const statusCounts = {
            'Urgente': 0,
            'Atención': 0,
            'Pendiente': 0
        };

        area.tasks.forEach(task => {
            if (statusCounts.hasOwnProperty(task.status)) {
            statusCounts[task.status]++;
            }
        });

        return {
            name: area.name,
            ...statusCounts
        };
        });

        const labels = processedData.map(item => item.name);
        const urgenteData = processedData.map(item => item.Urgente);
        const atencionData = processedData.map(item => item.Atención);
        const pendienteData = processedData.map(item => item.Pendiente);

        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
            {
                label: 'Urgente',
                data: urgenteData,
                backgroundColor: '#ff000070',
                borderColor: '#fff',
                borderWidth: 1
            },
            {
                label: 'Atención',
                data: atencionData,
                backgroundColor: '#F59E0B70',
                borderColor: '#fff',
                borderWidth: 1
            },
            {
                label: 'Pendiente',
                data: pendienteData,
                backgroundColor: '#16A34A70',
                borderColor: '#fff',
                borderWidth: 1
            }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, 
                },
            title: {
                display: true,
                padding: 20
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                title: function(context) {
                    return context[0].label;
                },
                label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} tareas`;
                }
                }
            }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                    display: true,
                    },
                    ticks: {
                    maxRotation: 45,
                    minRotation: 0
                    }
                },
                y: {
                stacked: true,
                beginAtZero: true,
                min: 0,
                max: 10,
                title: {
                    display: true,
                },
                ticks: {
                    stepSize: 1,
                    autoSkip: false,
                    callback: function(value) {
                    return Number.isInteger(value) ? value.toString() : '';
                    }
                }
                }

            }
        }
        });

        // Cleanup function
        return () => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        };
    }, []);

    const lineDatasets = [
        {
            label: 'Urgente',
            data: [4, 6, 2, 7, 3, 5, 8],
            borderColor: '#DC262670',
            backgroundColor: 'rgba(220, 38, 38, 0.3)',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Atención',
            data: [3, 2, 4, 6, 1, 5, 2],
            borderColor: '#F59E0B70',
            backgroundColor: 'rgba(245, 158, 11, 0.3)',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Pendiente',
            data: [5, 4, 3, 2, 1, 0, 2],
            borderColor: '#16A34A70',
            backgroundColor: 'rgba(22, 163, 74, 0.3)',
            tension: 0.4,
            fill: false
        }
    ];

    useEffect(() => {
        if (!lineChartRef.current) return;

        if (lineChartInstance.current) {
            lineChartInstance.current.destroy();
        }

        const ctx = lineChartRef.current.getContext('2d');
        lineChartInstance.current = new Chart.Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                datasets: lineDatasets // Usar el array definido arriba
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        padding: 20
                    },
                    legend: {
                        display: false // CAMBIAR ESTO: de 'top' a false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 10
                    }
                }
            }
        });

        return () => {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
        };
    }, []);


    return ( 
        <Layout>
            <h1 className="text-sm text-gray-500">Home</h1>
            <hr className="my-4 border-gray-200"/>
            <div className="flex flex-col gap-2 shadow-md bg-gradient-to-tr from-[#0f7871] to-[#13b2a0] rounded-2xl p-6">
                <h1 className="text-white font-bold text-2xl">
                    Hola {nombre}
                </h1>
                <p className="text-white text-xs">Sistema de gestión hospitalaria operando correctamente</p>
                <p className="text-white text-xs mt-4">Última actualización: 2025-05-20</p>
            </div>
            <div className="flex gap-4 py-5">
                <CountingCard title="Pacientes Atendidos" count={156} icon="FaUsers" />
                <CountingCard title="Pacientes Atendidos" count={23} icon="IoBed" />
                <CountingCard title="Pacientes Atendidos" count={48} icon="FaUserDoctor" />
                <CountingCard title="Pacientes Atendidos" count={94} icon="IoBarChart" />
            </div>
            <div className="grid grid-cols-[60%_1fr] gap-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-white shadow-md rounded-2xl p-4">
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <h1 className="text-gray-800 font-bold text-lg">Actividad Reciente</h1>
                                <p className="text-gray-500 text-sm">Últimos 30 días</p>
                            </div>
                            <NavLink to="/notification">
                                <button className="px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">Ver más</button>
                            </NavLink>
                        </div>
                        <div className="mt-4">
                            <div className="divide-y divide-gray-200">
                                {lastNotifications.map((notification) => (
                                <div key={notification.id} className="flex items-center py-2">
                                    <PiSirenDuotone className={`${notification.type === "critical" ? "text-red-500" : notification.type === "emergency" ? "text-yellow-500" : "text-green-500"}  mr-3 mt-1`} size={24} />
                                    <div className="flex flex-col flex-1">
                                        <p className="text-gray-800">{notification.title}</p>
                                        <b className="text-xs font-semibold text-gray-800">{notification.area}</b>
                                    </div>
                                    <span className="text-gray-500 text-sm ml-4 whitespace-nowrap">{notification.time}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 gap-2">
                    <h1 className="text-gray-800 font-bold text-lg">Acciones Rapidas</h1>
                        <div className="flex gap-2 items-center border border-gray-300 bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                            <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-2">
                                <PiSirenDuotone className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-gray-800 font-semibold text-sm ">Gestionar emergencias</h1>
                            </div>
                        </div>
                    <NavLink to="/admin">
                        <div className="flex gap-2 items-center border border-gray-300 bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                            <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-2">
                                <PiUsersThreeFill className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-gray-800 font-semibold text-sm ">Gestion de personal</h1>
                            </div>
                        </div>
                    </NavLink>
                    <div className="flex gap-2 items-center border border-gray-300 bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                        <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-2">
                            <BiSolidReport className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-gray-800 font-semibold text-sm ">Descargar reporte del ultimo mes</h1>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center border border-gray-300 bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                        <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-2">
                            <IoSettingsSharp className="text-white" size={20} />
                        </div>
                        <NavLink to="/profile">
                            <div>
                                <h1 className="text-gray-800 font-semibold text-sm ">Configuración</h1>
                            </div>
                        </NavLink>
                    </div>
                    <div className="mt-4">
                        {/* Aquí iría el gráfico */}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 my-6">
                    <div className="bg-white shadow-md rounded-2xl p-4">
                        <h1 className="text-gray-800 font-bold text-lg">Semaforos por area (de la semana)</h1>
                        <div className="flex justify-center gap-6 -mb-10 mt-5">
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#DC2626" />
                                <span className="text-sm font-medium text-gray-700">Urgente</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#F59E0B" />
                                <span className="text-sm font-medium text-gray-700">Atención</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#16A34A" />
                                <span className="text-sm font-medium text-gray-700">Pendiente</span>
                            </div>
                        </div>
                        <div className="relative h-full">
                            <canvas ref={chartRef} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-2xl p-4">
                        <h1 className="text-gray-800 font-bold text-lg">Semaforos de todas las areas (de la semana)</h1>
                        <div className="flex justify-center gap-6 -mb-10 mt-5">
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#DC2626" />
                                <span className="text-sm font-medium text-gray-700">Urgente</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#F59E0B" />
                                <span className="text-sm font-medium text-gray-700">Atención</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PiSirenDuotone size={20} color="#16A34A" />
                                <span className="text-sm font-medium text-gray-700">Pendiente</span>
                            </div>
                        </div>
                        
                        <div className="relative h-full">
                            <canvas ref={lineChartRef} />
                        </div>
                    </div>
            </div>
            
        </Layout>
    );
}

export default Home;