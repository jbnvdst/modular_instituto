import React from "react";

const SemaphoreCard = ({ semaphore }) => {
    const { id, name, description, owner } = semaphore;
    const tasksCount = semaphore.tasks.map((task) => task.status).reduce((acc, status) => {
        if (status === 'Urgente') {
            acc.urgent += 1;
        }
        if (status === 'Atención') {
            acc.attention += 1;
        }
        if (status === 'Pendiente') {
            acc.pending += 1;
        }
        return acc;
    }
    , { urgent: 0, attention: 0, pending: 0 });

    // const getStatusColor = (status) => {
    //     switch (status) {
    //         case 'Urgente':
    //             return 'bg-gradient-to-tr from-red-700 to-rose-700 text-white';
    //         case 'Atención':
    //             return 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white';
    //         case 'Pendiente':
    //             return 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white';
    //         default:
    //             return 'bg-gray-200 text-black';
    //     }
    // }

    const calculateOrder = () => {
        let order = 0;
        semaphore.tasks.forEach((task) => {
            if (task.status === 'Urgente') {
                order += 100;
            }
            if (task.status === 'Atención') {
                order += 10;
            }
            if (task.status === 'Pendiente') {
                order += 1;
            }
        });
        return order;
    }
    

    return (
        <div className={`flex flex-col justify-between rounded-[32px] w-64 shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.1)] hover:-translate-y-0.5 duration-200 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white order-${calculateOrder()}`}>
            <div className="flex flex-col justify-between h-full gap-2 p-4">
                <h2 className="text-2xl font-semibold">{name}</h2>
                <p className="text-sm">{description}</p>
                <b className="text-sm">Encargado: {owner}</b>
                <button onClick={() => alert(`Semaphore ID: ${id}`)} className="px-2 py-1 border-2 rounded-full text-sm font-semibold">View Details</button>
            </div>
            <div className="w-full bg-gray-200 grid grid-cols-3 p-2 rounded-b-[32px]">
                <div className="flex flex-col items-center text-rose-700 border-r border-white">
                    <h3 className="text-xl font-semibold">{tasksCount.urgent}</h3>
                    <p className="uppercase text-[10px] font-medium">Urgente</p>
                </div>
                <div className="flex flex-col items-center text-amber-500 border-r border-white">
                    <h3 className="text-xl font-semibold">{tasksCount.attention}</h3>
                    <p className="uppercase text-[10px] font-medium">En atención</p>
                </div>
                <div className="flex flex-col items-center text-teal-500">
                    <h3 className="text-xl font-semibold">{tasksCount.pending}</h3>
                    <p className="uppercase text-[10px] font-medium">Pendiente</p>
                </div>
            </div>
        </div>
    );
}

export { SemaphoreCard };