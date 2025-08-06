import React, { useEffect } from "react";

const SemaphoreCard = ({ semaphore, setSelectedArea, orderByQualification }) => { 
    const [order, setOrder] = React.useState(0);
    const [average, setAverage] = React.useState(0);
    const { id, name, description, ownerUser } = semaphore;

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
        <div 
            className={`
                flex flex-col overflow-hidden justify-between 
                rounded-2xl sm:rounded-3xl 
                w-full
                shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.1)] 
                hover:-translate-y-1 duration-200 bg-white
                min-h-[240px] sm:min-h-[280px]
            `} 
            style={{ order: orderByQualification ? Math.floor(average) : order }}
        >
            <div className="flex flex-col justify-between h-full">
                {/* Header con color dinámico */}
                <div 
                    className="flex justify-between items-center w-full px-3 sm:px-4 py-3 sm:py-4" 
                    style={{ backgroundColor: getColor(order) }}
                >
                    <h2 
                        onClick={() => console.log(semaphore)} 
                        className="text-lg sm:text-xl md:text-2xl text-white font-semibold truncate flex-1 mr-2"
                    >
                        {name}
                    </h2>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold">
                        {Math.floor(average)}
                    </h1>
                </div>
                
                {/* Contenido */}
                <div className="flex flex-col h-full justify-between gap-2 px-3 sm:px-4 py-3 sm:pb-4">
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                    <b className="text-xs sm:text-sm text-gray-700 truncate">
                        Encargado: {ownerUser.name}
                    </b>
                    <button 
                        onClick={() => setSelectedArea(semaphore)} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 
                                 border-2 rounded-full 
                                 text-xs sm:text-sm font-semibold 
                                 cursor-pointer hover:bg-gray-200 hover:text-teal-500 
                                 duration-200 transition-colors
                                 w-full"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
            
            {/* Footer con estadísticas */}
            <div className="w-full bg-gray-100 grid grid-cols-3 p-2 rounded-b-2xl sm:rounded-b-3xl">
                <div className="flex flex-col items-center text-rose-700 border-r border-gray-200">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                        {tasksCount.urgent}
                    </h3>
                    <p className="uppercase text-[9px] sm:text-[10px] font-medium">
                        Urgente
                    </p>
                </div>
                <div className="flex flex-col items-center text-amber-500 border-r border-gray-200">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                        {tasksCount.attention}
                    </h3>
                    <p className="uppercase text-[9px] sm:text-[10px] font-medium text-center">
                        En atención
                    </p>
                </div>
                <div className="flex flex-col items-center text-teal-500">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                        {tasksCount.pending}
                    </h3>
                    <p className="uppercase text-[9px] sm:text-[10px] font-medium">
                        Pendiente
                    </p>
                </div>
            </div>
        </div>
    );
}

export { SemaphoreCard };