import React from "react";
import { PiSirenDuotone } from "react-icons/pi";
import { FaFileArrowDown } from "react-icons/fa6";
import { useAuth } from "../../utils/context/AuthContext";

const TaskCard = ({ task }) => {
    const color = task.priority === 'rojo' ? 'text-rose-700' : task.priority === 'amarillo' ? 'text-amber-500' : 'text-teal-500';
    const { getDate } = useAuth();
    // console.log(task);

    return (
        <div key={task.id} className={`flex items-center py-2 border-l-4 pl-3 border-b ${task.priority === "rojo" ? " border-[#ef444490]" : task.priority === "amarillo" ? "border-[#f59e0b90]" : "border-[#10b98190]"} `}>
            <PiSirenDuotone className={`${task.priority === "rojo" ? "text-red-500" : task.priority === "amarillo" ? "text-yellow-500" : "text-green-500"}  mr-3 mt-1`} size={24} />
            <div className="flex flex-col flex-1">
                <b className="text-xs font-semibold text-gray-800">{task.subArea?.name}</b>
                <p onClick={() => console.log(task)} className="text-gray-800">{task.title}</p>
            </div>
            <span className="text-gray-500 text-sm ml-4 whitespace-nowrap">{getDate(task.createdAt)}</span>
        </div>
    );
}

export { TaskCard };