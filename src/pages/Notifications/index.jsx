import React, { useState } from "react";
import { Bell, AlertTriangle, Clock, CheckCircle, Users, Activity, Thermometer, Stethoscope, Heart, Brain } from "lucide-react";
import Layout from "../../components/Layout"; 

const Notifications = () => {
    const [notifications] = useState([
        {
            id: 1,
            type: "urgente",
            title: "Falta de Oxígeno en UCI",
            area: "Unidad de Cuidados Intensivos",
            description: "Reservas de oxígeno por debajo del 20%. Requiere reabastecimiento inmediato.",
            time: "2 minutos",
            icon: <Thermometer className="w-5 h-5" />,
            priority: "high"
        },
        {
            id: 2,
            type: "urgente",
            title: "Personal Insuficiente en Emergencias",
            area: "Sala de Emergencias",
            description: "Solo 2 enfermeros disponibles para 15 pacientes en espera.",
            time: "8 minutos",
            icon: <Users className="w-5 h-5" />,
            priority: "high"
        },
        {
            id: 3,
            type: "atencion",
            title: "Mantenimiento de Equipos Programado",
            area: "Cardiología",
            description: "Revisión preventiva de electrocardiógrafos programada para mañana.",
            time: "15 minutos",
            icon: <Heart className="w-5 h-5" />,
            priority: "medium"
        },
        {
            id: 4,
            type: "atencion",
            title: "Solicitud de Materiales Quirúrgicos",
            area: "Quirófano 3",
            description: "Instrumentos especializados para cirugía de neurocirugía.",
            time: "25 minutos",
            icon: <Brain className="w-5 h-5" />,
            priority: "medium"
        },
        {
            id: 5,
            type: "pendiente",
            title: "Informe Mensual de Pediatría",
            area: "Pediatría",
            description: "Estadísticas del mes disponibles para revisión.",
            time: "1 hora",
            icon: <Stethoscope className="w-5 h-5" />,
            priority: "low"
        },
        {
            id: 6,
            type: "pendiente",
            title: "Capacitación de Personal Completada",
            area: "Recursos Humanos",
            description: "15 enfermeros completaron el curso de actualización.",
            time: "2 horas",
            icon: <CheckCircle className="w-5 h-5" />,
            priority: "low"
        }
    ]);

    const [filter, setFilter] = useState('todas');

    const getTypeConfig = (type) => {
        const configs = {
            urgente: {
                bgColor: 'bg-red-50',
                borderColor: 'border-l-red-500',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                textColor: 'text-red-800',
                count: notifications.filter(n => n.type === 'urgente').length
            },
            atencion: {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-l-yellow-500',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                textColor: 'text-yellow-800',
                count: notifications.filter(n => n.type === 'atencion').length
            },
            pendiente: {
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                textColor: 'text-green-800',
                count: notifications.filter(n => n.type === 'pendiente').length
            }
        };
        return configs[type];
    };

    const filteredNotifications = filter === 'todas' 
        ? notifications 
        : notifications.filter(n => n.type === filter);

    const urgentCount = notifications.filter(n => n.type === 'urgente').length;
    const attentionCount = notifications.filter(n => n.type === 'atencion').length;
    const pendingCount = notifications.filter(n => n.type === 'pendiente').length;

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                    
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Centro de alertas y comunicaciones hospitalarias</p>
                    </div>
                </div>
                <hr className="my-4 border-gray-200"/>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                        <Bell className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{notifications.length} Total</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto py-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Urgentes</p>
                                    <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Atención</p>
                                    <p className="text-2xl font-bold text-gray-900">{attentionCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-teal-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-teal-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Sistema</p>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <p className="text-sm font-medium text-green-600">Operativo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h2>
                                        <span className="text-sm text-gray-500">Últimas 24 horas</span>
                                    </div>
                                    
                                    {/* Filter Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilter('todas')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                filter === 'todas' 
                                                    ? 'bg-teal-100 text-teal-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => setFilter('urgente')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                filter === 'urgente' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Urgente ({urgentCount})
                                        </button>
                                        <button
                                            onClick={() => setFilter('atencion')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                filter === 'atencion' 
                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Atención ({attentionCount})
                                        </button>
                                        <button
                                            onClick={() => setFilter('pendiente')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                filter === 'pendiente' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Pendiente ({pendingCount})
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {filteredNotifications.map((notification) => {
                                        const config = getTypeConfig(notification.type);
                                        return (
                                            <div key={notification.id} className={`p-6 ${config.bgColor} border-l-4 ${config.borderColor}`}>
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-2 ${config.iconBg} rounded-lg`}>
                                                        <div className={config.iconColor}>
                                                            {notification.icon}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-sm font-semibold text-gray-900">
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">
                                                                hace {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700 mt-1">
                                                            {notification.area}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {notification.description}
                                                        </p>
                                                        <div className="flex items-center mt-3 space-x-3">
                                                            <button className="text-xs font-medium text-teal-600 hover:text-teal-800">
                                                                Ver detalles
                                                            </button>
                                                            <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                                                                Marcar como leída
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center p-3 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                                        <Bell className="w-5 h-5 text-teal-600 mr-3" />
                                        <span className="text-sm font-medium text-teal-800">Crear Alerta</span>
                                    </button>
                                    <button className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Users className="w-5 h-5 text-gray-600 mr-3" />
                                        <span className="text-sm font-medium text-gray-700">Contactar Área</span>
                                    </button>
                                    <button className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Activity className="w-5 h-5 text-gray-600 mr-3" />
                                        <span className="text-sm font-medium text-gray-700">Ver Reportes</span>
                                    </button>
                                </div>
                            </div>

                            {/* Status by Area */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado por Área</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">UCI</span>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Emergencias</span>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Cardiología</span>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Quirófanos</span>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Pediatría</span>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Recursos Humanos</span>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Notifications;