import React from "react";

const SemaphoreCard = ({ semaphore }) => {
    const { id, name, description, status } = semaphore;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Urgente':
                return 'bg-gradient-to-tr from-red-700 to-rose-700 text-white';
            case 'Atención':
                return 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white';
            case 'Pendiente':
                return 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white';
            default:
                return 'bg-gray-200 text-black';
        }
    }

    return (
        <div className={`p-4 rounded-[32px] w-64 ${getStatusColor(status)}`}>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Status: {status}</p>
            <button onClick={() => alert(`Semaphore ID: ${id}`)}>View Details</button>
        </div>
    );
}

export { SemaphoreCard };