import React from "react";
import { Card } from "../../components/Card";
import { SemaphoreCard } from "../../components/SemaphoreCard";

const Semaphores = () => {
    const areas = [
        { id: 1, name: "Farmacia", description: "Description 1", status: "Atención" },
        { id: 2, name: "Oncología", description: "Description 2", status: "Pendiente" },
        { id: 3, name: "Oncología", description: "Description 2", status: "Pendiente" },
        { id: 4, name: "Oncología", description: "Description 2", status: "Urgente" },
        { id: 5, name: "Oncología", description: "Description 2", status: "Pendiente" },
        { id: 6, name: "Urgencias", description: "Description 3", status: "Urgente" },
    ];
    
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-sm text-gray-500">Semaphores</h2>
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <h3 className="text-sm text-gray-500">Áreas</h3>
                    <b className="text-black">{areas.length}</b>
                </Card>
                <Card>
                    <h3 className="text-sm text-gray-500">Tareas urgentes</h3>
                    <b className="text-black">{areas.filter((area) => area.status === 'Urgente').length}</b>
                </Card>
                <Card>
                    <h3 className="text-sm text-gray-500">Tareas en atención</h3>
                    <b className="text-black">{areas.filter((area) => area.status === 'Atención').length}</b>
                </Card>
                <Card>
                    <h3 className="text-sm text-gray-500">Tareas pendientes</h3>
                    <b className="text-black">{areas.filter((area) => area.status === 'Pendiente').length}</b>
                </Card>
            </div>
            <h2 className="text-sm text-gray-500">Áreas</h2>
            <div className="flex flex-wrap gap-4">
                {areas.map((area) => (
                    <SemaphoreCard key={area.id} semaphore={area} />
                ))}
            </div>
        </div>
    );
}

export default Semaphores;