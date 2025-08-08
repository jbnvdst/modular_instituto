import React, { useEffect, useState } from "react";
import { Bell, AlertTriangle, Clock, CheckCircle, Users, Activity } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../utils/context/AuthContext";
import { useAreas } from "../../utils/context/AreasContext";
import { AddTask, Notification } from '../../components';
import Layout from "../../components/Layout";

const Notifications = () => {
    // TODOS LOS ESTADOS - NO BORRAR
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('todas');
    const { user } = useAuth(); 
    const { areas } = useAreas();
    const redNotificationTypes = ['critical_task'];
    const yellowNotificationTypes = ['solved_task', 'area_created'];
    const greenNotificationTypes = ['user_added_to_area', 'user_removed_from_area', 'welcome'];
    const [showAddTask, setShowAddTask] = useState(false);

    // TUS USEEFFECTS - NO CAMBIAR
    useEffect(() => {
        if (user && user.id) {
            fetchNotifications();
        }
    }, [user]);

    // TUS FUNCIONES - NO CAMBIAR
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification/user/${user.id}`);
            setNotifications(response.data);
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const getFilteredNotifications = () => {
        if (filter === 'todas') return notifications.filter(n => !n.read);
        if (filter === 'urgente') return notifications.filter(n => (redNotificationTypes.includes(n.type) && !n.read));
        if (filter === 'atencion') return notifications.filter(n => (yellowNotificationTypes.includes(n.type) && !n.read));
        if (filter === 'pendiente') return notifications.filter(n => (greenNotificationTypes.includes(n.type) && !n.read));
        if (filter === 'leidos') return notifications.filter(n => n.read);
        return notifications;
    };

    const getColor = (tasks) => {
        if(tasks.length === 0) return 0;
        let order = 0;
        tasks.forEach((task) => {
            if (task.priority === 'rojo') {
                order += 100;
            }
            if (task.priority === 'amarillo') {
                order += 10;
            }
            if (task.priority === 'verde') {
                order += 1;
            }
        }); 
        order = order * -1;

        let avg = order < 0 ? 100 - (order * -1 / tasks.length) : 100;
        avg = Math.max(0, Math.min(100, avg));

        const red =    { r: 255, g: 0,   b: 0,   a: 112 };
        const yellow = { r: 245, g: 158, b: 11,  a: 112 };
        const green =  { r: 22,  g: 163, b: 74,  a: 112 };

        let start, end, ratio;

        if (avg <= 50) {
            ratio = avg / 50;
            start = red;
            end = yellow;
        } else {
            ratio = (avg - 50) / 50;
            start = yellow;
            end = green;
        }

        const r = Math.round(start.r + (end.r - start.r) * ratio);
        const g = Math.round(start.g + (end.g - start.g) * ratio);
        const b = Math.round(start.b + (end.b - start.b) * ratio);
        const a = Math.round(start.a + (end.a - start.a) * ratio);

        const toHex = (c) => c.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    };

    // CONTADORES
    const urgentCount = notifications.filter(n => (redNotificationTypes.includes(n.type) && !n.read)).length;
    const attentionCount = notifications.filter(n => (yellowNotificationTypes.includes(n.type) && !n.read)).length;
    const pendingCount = notifications.filter(n => (greenNotificationTypes.includes(n.type) && !n.read)).length;
    const readCount = notifications.filter(n => n.read).length;

    // RENDER - AQUÍ EMPIEZAN LOS CAMBIOS RESPONSIVE
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Centro de alertas y comunicaciones hospitalarias
                        </p>
                    </div>
                </div>
                <hr className="my-3 sm:my-4 border-gray-200"/>
                
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                        <Bell className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm font-medium">{notifications.length} Total</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto py-4 sm:py-6">
                    {/* Stats Cards - Grid Responsive */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Urgentes</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{urgentCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Atención</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{attentionCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pendientes</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{pendingCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="p-2 sm:p-3 bg-teal-100 rounded-lg">
                                    <Activity className="w-5 sm:w-6 h-5 sm:h-6 text-teal-600" />
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Sistema</p>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                                        <p className="text-xs sm:text-sm font-medium text-green-600">Operativo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout principal - De 3 columnas a 1 en móvil */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 order-1">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                            Notificaciones Recientes
                                        </h2>
                                    </div>
                                    
                                    {/* Filter Buttons - Scroll horizontal en móvil */}
                                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                        <button
                                            onClick={() => setFilter('todas')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                filter === 'todas' 
                                                    ? 'bg-teal-100 text-teal-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => setFilter('urgente')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                filter === 'urgente' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Urgente ({urgentCount})
                                        </button>
                                        <button
                                            onClick={() => setFilter('atencion')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                filter === 'atencion' 
                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Atención ({attentionCount})
                                        </button>
                                        <button
                                            onClick={() => setFilter('pendiente')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                filter === 'pendiente' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Pendiente ({pendingCount})
                                        </button>
                                        <button
                                            onClick={() => setFilter('leidos')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                filter === 'leidos' 
                                                    ? 'bg-blue-100 text-blue-600' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Leídos ({readCount})
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de notificaciones */}
                                <div className="flex flex-col max-h-[40vh] sm:max-h-[50vh] overflow-y-auto scrollbar-hide divide-y divide-gray-200">
                                    {getFilteredNotifications().map((notification) => 
                                        <Notification 
                                            key={notification.id} 
                                            notification={notification} 
                                            setNotifications={setNotifications} 
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4 sm:space-y-6 order-2">
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                    Estado por Área
                                </h3>
                                <div className="space-y-3 sm:space-y-4 max-h-[520px] overflow-y-auto scrollbar-hide">
                                    {areas.map((area) => (
                                        <div 
                                            key={area.id} 
                                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">
                                                {area.name}
                                            </span>
                                            <div 
                                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                                style={{backgroundColor: getColor(area.tasks)}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showAddTask && (
                <AddTask 
                    onClick={() => setShowAddTask(false)} 
                    fetchAlerts={fetchNotifications} 
                />
            )}
        </Layout>
    );
};

export default Notifications;