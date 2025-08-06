import React, { useEffect } from "react";
import closeIcon from "../../assets/icons/close.png";
import { TaskCard } from "../TaskCard";

const SemaphoreDetail = ({ semaphore, onClose }) => {
    const [order, setOrder] = React.useState(0);
    const { id, name, description, ownerUser } = semaphore;
    const [average, setAverage] = React.useState(0);

    useEffect(() => {
        let value = calculateOrder();
        setOrder(value);
        setAverage(value < 0 ? 100 - (value * -1 / semaphore.tasks.length) : 100);
    }, [semaphore.tasks]);

    const calculateOrder = () => {
        if(semaphore.tasks.length === 0) return 0;
        let order = 0;
        semaphore.tasks.forEach((task) => {
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
        return order * -1;
    };
    
    const tasksCount = semaphore.tasks.map((task) => task.priority).reduce((acc, priority) => {
        if (priority === 'rojo') {
            acc.urgent += 1;
        }
        if (priority === 'amarillo') {
            acc.attention += 1;
        }
        if (priority === 'verde') {
            acc.pending += 1;
        }
        return acc;
    }, { urgent: 0, attention: 0, pending: 0 }); 

    const getColor = () => {
        let avg = average;
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
    }

    return (
        <div className="fixed w-full h-full left-0 top-0 bg-[#000000B1] flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl sm:rounded-3xl bg-white w-full max-w-[600px] max-h-[90vh] overflow-hidden">
                <div 
                    className="flex flex-col justify-between rounded-2xl sm:rounded-3xl shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.1)] text-white" 
                    style={{ backgroundColor: getColor(order) }}
                >
                    {/* Header */}
                    <div className="flex flex-col justify-between h-full gap-2 p-3 sm:p-4">
                        <div className="flex justify-between items-start w-full">
                            <h2 className="text-xl sm:text-2xl font-semibold flex-1 mr-2">
                                {name}
                            </h2>
                            <button 
                                onClick={() => onClose(null)}
                                className="p-2 -m-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <img 
                                    src={closeIcon} 
                                    alt="Close" 
                                    className="w-5 h-5 sm:w-4 sm:h-4 cursor-pointer invert" 
                                />
                            </button>
                        </div>
                        <p className="text-xs sm:text-sm opacity-90">
                            {description}
                        </p>
                        <b className="text-xs sm:text-sm">
                            Encargado: {ownerUser.name}
                        </b>
                    </div>
                    
                    {/* Tasks List - Scrolleable */}
                    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-white max-h-[40vh] sm:max-h-[50vh] overflow-y-auto scrollbar-hide">
                        {semaphore.tasks.length > 0 ? (
                            semaphore.tasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <h1 className="text-gray-500 text-center py-8 text-sm sm:text-base">
                                No hay ninguna tarea en esta área
                            </h1>
                        )}
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="w-full bg-gray-100 grid grid-cols-3 p-2 rounded-b-2xl sm:rounded-b-3xl">
                        <div className="flex flex-col items-center text-rose-700 border-r border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold">
                                {tasksCount.urgent}
                            </h3>
                            <p className="uppercase text-[9px] sm:text-[10px] font-medium">
                                Urgente
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-amber-500 border-r border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold">
                                {tasksCount.attention}
                            </h3>
                            <p className="uppercase text-[9px] sm:text-[10px] font-medium text-center">
                                En atención
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-teal-500">
                            <h3 className="text-lg sm:text-xl font-semibold">
                                {tasksCount.pending}
                            </h3>
                            <p className="uppercase text-[9px] sm:text-[10px] font-medium">
                                Pendiente
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { SemaphoreDetail };