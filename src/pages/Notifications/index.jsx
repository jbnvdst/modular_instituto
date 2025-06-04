import React, { useEffect, useState } from "react";
import { Bell, AlertTriangle, Clock, CheckCircle, Users, Activity, Thermometer, Stethoscope, Heart, Brain } from "lucide-react";
import Layout from "../../components/Layout"; 
import axios from "axios";
import { useAuth } from "../../utils/context/AuthContext"; // Assuming you have an AuthContext for user authentication
import { Notification } from "../../components/Notification";

const Notifications = () => {
    const [notifications , setNotifications ] = useState([]);
    const [filter, setFilter] = useState('todas');
    const { user } = useAuth(); 
    const redNotificationTypes = ['critical_task']
    const yellowNotificationTypes = ['solved_task', 'area_created']
    const greenNotificationTypes = ['user_added_to_area', 'user_removed_from_area', 'welcome']

    useEffect(() => {
        fetchNotifications();
    }, []);

        const fetchNotifications = async () => {
        try {
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification/user/${user.id}`);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification/user/e6739733-62d2-4875-a100-e45a8225c2d9`);
            setNotifications(response.data);
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
        }};

    const getFilteredNotifications = () => {
    if (filter === 'todas') return notifications;
    if (filter === 'urgente') return notifications.filter(n => redNotificationTypes.includes(n.type));
    if (filter === 'atencion') return notifications.filter(n => yellowNotificationTypes.includes(n.type));
    if (filter === 'pendiente') return notifications.filter(n => greenNotificationTypes.includes(n.type));
    return notifications;
    };

    

    const filteredNotifications = filter === 'todas' 
        ? notifications 
        : notifications.filter(n => filter.includes(n.type));

    const urgentCount = notifications.filter(n => redNotificationTypes.includes(n.type)).length;
    const attentionCount = notifications.filter(n => yellowNotificationTypes.includes(n.type)).length;
    const pendingCount = notifications.filter(n => greenNotificationTypes.includes(n.type)).length;

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
                                    {getFilteredNotifications().map((notification) => 
                                        <Notification key={notification.id} notification={notification} />
                                    )}
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

                            {/* Status by relatedArea.name */}
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