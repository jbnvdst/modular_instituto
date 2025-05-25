import React, { useRef, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { CountingCard } from "../../components/CountingCard";
import { PiNotificationDuotone, PiSirenDuotone } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import { PiUsersThreeFill } from "react-icons/pi";
import { BiSolidReport } from "react-icons/bi";
import { lastNotifications } from "../../utils/data/lastNotifications";
import * as Chart from "chart.js/auto";
import { areas } from "../../utils/data/areas";

const Home = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

     useEffect(() => {
        Chart.Chart.register(
        Chart.CategoryScale,
        Chart.LinearScale,
        Chart.BarElement,
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
                backgroundColor: '#DC2626',
                borderColor: '#B91C1C',
                borderWidth: 1
            },
            {
                label: 'Atención',
                data: atencionData,
                backgroundColor: '#F59E0B',
                borderColor: '#D97706',
                borderWidth: 1
            },
            {
                label: 'Pendiente',
                data: pendienteData,
                backgroundColor: '#16A34A',
                borderColor: '#15803D',
                borderWidth: 1
            }
            ]
        },
        options: {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'Tareas por Área Hospitalaria',
                font: {
                size: 18,
                weight: 'bold'
                },
                padding: 20
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                padding: 20,
                font: {
                    size: 12
                }
                }
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
                text: 'Áreas Hospitalarias',
                font: {
                    size: 14,
                    weight: 'bold'
                }
                },
                ticks: {
                maxRotation: 45,
                minRotation: 0
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                title: {
                display: true,
                text: 'Número de Tareas',
                font: {
                    size: 14,
                    weight: 'bold'
                }
                },
                ticks: {
                stepSize: 1
                }
            }
            },
            interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
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
  
    return (
        <Layout>
            <h1 className="text-sm text-gray-500">Home</h1>
            <hr className="my-4 border-gray-200"/>
            <div className="flex flex-col gap-2 shadow-md bg-gradient-to-tr from-[#0f7871] to-[#13b2a0] rounded-2xl p-6">
                <h1 className="text-white font-bold text-2xl">Bienvenido, Dr. García</h1>
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
                            <button className="px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">Ver más</button>
                        </div>
                        <div className="mt-4">
                            <div className="divide-y divide-gray-200">
                                {lastNotifications.map((notification) => (
                                <div className="flex items-center py-2">
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
                            <h1 className="text-gray-800 font-semibold text-sm ">Gestionar Emergencias</h1>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center border border-gray-300 bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                        <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-2">
                            <PiUsersThreeFill className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-gray-800 font-semibold text-sm ">Gestion de personal</h1>
                        </div>
                    </div>
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
                        <div>
                            <h1 className="text-gray-800 font-semibold text-sm ">Configuración</h1>
                        </div>
                    </div>
                    <div className="mt-4">
                        {/* Aquí iría el gráfico */}
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <h1 className="text-gray-800 font-bold text-lg">Estadisticas</h1>
                    <div className="relative h-96">
                        <canvas ref={chartRef} />
                    </div>
                </div>
            </div>
            
        </Layout>
    );
}

export default Home;