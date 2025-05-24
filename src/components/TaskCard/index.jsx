import React from "react";

const TaskCard = ({ task }) => {
    const color = task.status === 'Urgente' ? 'text-rose-700' : task.status === 'Atención' ? 'text-amber-500' : 'text-teal-500';

    const calculateDaysPast = (date) => {
        const today = new Date();
        const taskDate = new Date(date);
        const timeDiff = Math.abs(today - taskDate);
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    
    const pastDays = calculateDaysPast(task.date);

    return (
        <div style={{order: task.status === 'Urgente' ? '1' : task.status === 'Atención' ? '2' :'3'}} className='flex justify-between items-center bg-gray-200 p-2 rounded-lg'>
            <div className="flex flex-col">
                <div className={`bg-${color}`}>
                    <h3 className="text-sm font-semibold text-gray-900">{task.name}</h3>
                </div>
                <p className='text-xs text-gray-500'>Solicitado por: {task.askedBy}</p>
                <p className='text-xs text-gray-500'>{pastDays === 0 ? 'Hoy' : pastDays === 1 ? 'Ayer' : `Hace ${pastDays} días`}</p>
            </div>
            <span className={`text-xs font-semibold ${task.status === 'Urgente' ? 'text-rose-700' : task.status === 'Atención' ? 'text-amber-500' : 'text-teal-500'}`}>{task.status}</span>
        </div>
    );
}

export { TaskCard };