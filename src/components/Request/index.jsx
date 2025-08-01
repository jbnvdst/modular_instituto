import React, { useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";

const Request = ({ request }) => {
    const [opened, setOpened] = useState(false);
    const { getDate } = useAuth();

    const handleOpen = () => {
        if(request.status === "Sin leer") {
            console.log("Marcar como leido");
        }
        setOpened(!opened);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Sin leer":
                return "bg-yellow-100 text-yellow-800";
            case "En progreso":
                return "bg-blue-100 text-blue-800";
            case "Resuelto":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div key={request.id} className={`${opened ? "max-h-64" : "max-h-32"} flex flex-col items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out`}>
            {!opened ? (
                <div className="flex flex-col w-full gap-2 ">
                    <div className="flex w-full items-center justify-between">
                        <h1 onClick={() => console.log(request)} className="text-gray-900 font-semibold text-sm">{request.request.title}</h1>
                        <h2 className={`text-sm p-y-0.5 px-2 rounded-xl ${getStatusColor(request.status)}`}>{request.status}</h2>
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <h3 className="text-sm text-gray-500">{getDate(request.request.createdAt)}</h3>
                        <span onClick={() => handleOpen()} className="cursor-pointer inline-flex px-2 py-1 text-sm text-white font-medium rounded-full bg-teal-600/80">Ver detalles</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full gap-2 items-center justify-between">
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-gray-900 font-semibold text-sm">{request.request.title}</h1>
                        <h2 className={`text-sm p-y-0.5 px-2 rounded-xl ${getStatusColor(request.status)}`}>{request.status}</h2>
                    </div>
                    <div className="flex flex-col w-full items-center justify-between">
                        <p className="text-xs bg-gray-100 w-full rounded-md p-2 mt-1">{request.request.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Solicitado por: {request.request.creator.name}</p>
                        <p className="text-xs text-gray-500">{getDate(request.request.createdAt)}</p>
                    </div>
                    <span onClick={() => handleOpen()} className="cursor-pointer inline-flex px-2 py-1 text-sm text-white font-medium rounded-full bg-teal-600/80">Cerrar</span>
                </div>
            )}
        </div>
    )
}

export { Request };