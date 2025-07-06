import React from 'react';
import { Icon } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center px-6 py-3 cursor-pointer font-medium rounded-lg transition-all duration-200 ${
            isActive 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
        <Icon size={20} className="mr-2" />
        {label}
    </button>
);

export { TabButton };