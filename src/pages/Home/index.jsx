import React from "react";
import { Layout } from "../../components/Layout";
import { CountingCard } from "../../components/CountingCard";
import { PiNotificationDuotone, PiSirenDuotone } from "react-icons/pi";

const Home = () => {
    const lastNotifications = [
        {
            id: 1,
            title: "Código Azul en Urgencias",
            area: "Sala de Urgencias",
            time: "5 minutos",
            type: "emergency"
        },
        {
            id: 2,
            title: "Consulta de Infectología Programada",
            area: "Consultorios Externos",
            time: "10 minutos",
            type: "advice"
        },
        {
            id: 3,
            title: "Alerta de Saturación en Pediatría",
            area: "Pediatría - Sala de Observación",
            time: "19 minutos",
            type: "advice"
        },
        {
            id: 4,
            title: "Fallo en Suministro de Oxígeno",
            area: "Quirófano 2",
            time: "20 minutos",
            type: "critical"
        },
        {
            id: 5,
            title: "Ingreso de Paciente con Politraumatismo",
            area: "Sala de Trauma - Urgencias",
            time: "30 minutos",
            type: "emergency"
        }
    ];

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
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <h1 className="text-gray-800 font-bold text-lg">Acciones Rapidas</h1>
                    <div className="flex gap-2 items-center">
                        <div className="flex justify-center items-center bg-[#0f7871] rounded-md p-3">
                            <PiSirenDuotone className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-gray-800 font-medium text-md">Código Azul</h1>
                        </div>
                    </div>
                    <div className="mt-4">
                        {/* Aquí iría el gráfico */}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Home;