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
        // console.log(`Order: ${value}, Average: ${100 - (value * -1 / semaphore.tasks.length)}`);
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

        // let average = order / semaphore.tasks.length;
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
    }
    , { urgent: 0, attention: 0, pending: 0 }); 

    const getColor = () => {
        let avg = average;
        // Asegura que el valor esté entre 0 y 100
        // Clamp entre 0 y 100
        avg = Math.max(0, Math.min(100, avg));

        // Define los colores como objetos RGBA
        const red =    { r: 255, g: 0,   b: 0,   a: 112 }; // #FF000070
        const yellow = { r: 245, g: 158, b: 11,  a: 112 }; // #F59E0B70
        const green =  { r: 22,  g: 163, b: 74,  a: 112 }; // #16A34A70

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
        <div className="fixed w-full h-svh left-0 top-0 bg-[#000000B1] flex items-center justify-center z-10">
            <div className="rounded-[32px] bg-white ">
                <div className={`flex flex-col justify-between rounded-[32px] w-[600px] shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.1)] text-white`} style={{ backgroundColor: getColor(order) }}>
                    <div className="flex flex-col justify-between h-full gap-2 p-4">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-2xl font-semibold">{name}</h2>
                            <img src={closeIcon} alt="Close" className="w-4 h-4 cursor-pointer invert" onClick={() => onClose(null)} />
                        </div>
                        <p className="text-sm">{description}</p>
                        <b className="text-sm">Encargado: {ownerUser.name}</b>
                    </div>
                    <div className="flex flex-col gap-2 p-4 bg-white max-h-[500px] overflow-y-auto scrollbar-hide">
                        {semaphore.tasks.length > 0 ? semaphore.tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        )) : <h1 className="text-gray-900">No hay niguna tarea en esta area</h1>}
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
        </div>
    );
}

export { SemaphoreDetail };