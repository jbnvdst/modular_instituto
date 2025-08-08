import React from 'react';
import { Icon } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`
            flex items-center justify-center sm:justify-start
            px-3 sm:px-6 py-2.5 sm:py-3 
            cursor-pointer font-medium rounded-lg 
            transition-all duration-200
            text-xs sm:text-sm
            min-w-fit
            ${isActive 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }
        `}
    >
        <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0 sm:mr-2" />
        {/* Texto completo en tablet y desktop */}
        <span className="hidden sm:inline whitespace-nowrap">{label}</span>
        {/* Texto abreviado en móvil */}
        <span className="sm:hidden ml-1.5 whitespace-nowrap">
            {label.length > 10 ? `${label.substring(0, 8)}...` : label}
        </span>
    </button>
);

export { TabButton };