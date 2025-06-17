import React, { useState } from 'react'
import { Bell } from "lucide-react";
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Notification({ notification , setNotifications }) {
    const redNotificationTypes = ['critical_task']
    const yellowNotificationTypes = ['solved_task', 'area_created']
    const [ loading , setLoading ] = useState(false);
    const { getDate } = useAuth();
    const navigate = useNavigate();

    const handleMarkAsRead = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/notification/markAsRead/${notification.id}`);
            if (response.status === 200) {
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: !n.read } : n));
            }
        } catch (error) {
            console.error('Error al marcar la notificación como leída:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const getConfig = () => {
        if (notification.read) {
            return {
                bgColor: 'bg-white',
                borderColor: "#cacaca",
                iconBg: "bg-gray-200",
                iconColor: "text-gray-400"
            }
        }
        else {
            return {
                bgColor: 'bg-white',
                borderColor: redNotificationTypes.includes(notification.type) ? '#ef444490' : yellowNotificationTypes.includes(notification.type) ? '#f59e0b90' : '#10b98190',
                iconBg: redNotificationTypes.includes(notification.type) ? 'bg-[#ef444420]' : yellowNotificationTypes.includes(notification.type) ? 'bg-[#f59e0b20]' : 'bg-[#10b98120]',
                iconColor: redNotificationTypes.includes(notification.type) ? 'text-[#ef4444]' : yellowNotificationTypes.includes(notification.type) ? 'text-[#f59e0b]' : 'text-[#10b981]'
            }
        }
    }

    const config = getConfig();

    

  return (
        <div key={notification.id} className={`p-6 ${config.bgColor} border-l-4`} style={{ borderColor: config.borderColor }}>
            <div className="flex items-start space-x-4">
                <div onClick={() => console.log(notification)} className={`p-2 rounded-full ${config.iconBg}`}>
                    <Bell className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {notification.message}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {getDate(notification.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                        {notification.relatedArea?.name || "Sin área"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        {notification.description}
                    </p>
                    <div className="flex items-center mt-3 space-x-3">
                        <button onClick={() => navigate(`/areas/${notification.relatedArea.id}`)} className="cursor-pointer text-xs font-medium text-teal-600 hover:text-teal-800">
                            Ir al área
                        </button>
                        <button onClick={ () => handleMarkAsRead(notification.id) } disabled={loading} className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700">
                            {loading ? "Cargando..." : notification.read ? "Marcar como no leída" : "Marcar como leída"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export { Notification }