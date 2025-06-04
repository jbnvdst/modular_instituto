import React from 'react'
import { Bell } from "lucide-react";

function Notification({ notification }) {
    const redNotificationTypes = ['critical_task']
    const yellowNotificationTypes = ['solved_task', 'area_created']


    const config = {
        bgColor: 'bg-white',
        borderColor: redNotificationTypes.includes(notification.type) ? '#ef444490' : yellowNotificationTypes.includes(notification.type) ? '#f59e0b90' : '#10b98190',
        iconBg: redNotificationTypes.includes(notification.type) ? 'bg-[#ef444420]' : yellowNotificationTypes.includes(notification.type) ? 'bg-[#f59e0b20]' : 'bg-[#10b98120]',
        iconColor: redNotificationTypes.includes(notification.type) ? 'text-[#ef4444]' : yellowNotificationTypes.includes(notification.type) ? 'text-[#f59e0b]' : 'text-[#10b981]'
    }

    // ['welcome', 'critical_task', 'solved_task', 'area_created','user_added_to_area','user_removed_from_area']
    console.log(config.borderColor)

    

  return (
        <div key={notification.id} className={`p-6 ${config.bgColor} border-l-4`} style={{ borderColor: config.borderColor }}>
            <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${config.iconBg}`}>
                    <Bell className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {notification.message}
                        </h3>
                        <span className="text-xs text-gray-500">
                            hace {notification.time}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                        {notification.relatedArea.name}
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
  )
}

export { Notification }