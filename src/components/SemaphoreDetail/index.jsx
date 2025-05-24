import React from "react";
import closeIcon from "../../assets/icons/close.png";
import { TaskCard } from "../TaskCard";

const SemaphoreDetail = ({ semaphore, onClose }) => {
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

    return (
        <div className="fixed w-full h-svh left-0 top-0 bg-[#000000B1] flex items-center justify-center z-10">
            <div className={`flex flex-col justify-between rounded-[32px] w-[600px] shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.1)] bg-gradient-to-tr from-emerald-500 to-teal-600 text-white`}>
                <div className="flex flex-col justify-between h-full gap-2 p-4">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-2xl font-semibold">{name}</h2>
                        <img src={closeIcon} alt="Close" className="w-4 h-4 cursor-pointer invert" onClick={() => onClose(null)} />
                    </div>
                    <p className="text-sm">{description}</p>
                    <b className="text-sm">Encargado: {owner}</b>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-white">
                    {semaphore.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
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
        </div>
    );
}

export { SemaphoreDetail };