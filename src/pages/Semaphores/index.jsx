import React from "react";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/Card";
import { SemaphoreCard } from "../../components/SemaphoreCard";

const Semaphores = () => {
    const areas = [
        { 
            id: 1,
            name: "Farmacia",
            description: "Suministro y control de medicamentos e insumos esenciales para el tratamiento.",
            owner: "Dr. Pedro Rodríguez",
            tasks: [
                { id: 1, name: "Falta surtir medicamento de quimioterapia", status: "Urgente" },
                { id: 2, name: "Inventario mensual pendiente", status: "Atención" },
                { id: 3, name: "Solicitar insumos al proveedor", status: "Pendiente" },
                { id: 4, name: "Revisión de protocolo para nuevo tratamiento", status: "Pendiente" },
                { id: 16, name: "Medicamentos refrigerados sin control de temperatura", status: "Urgente" },
                { id: 17, name: "Falta actualizar base de datos de fármacos", status: "Pendiente "}
            ]
        },
        { 
            id: 2,
            name: "Oncología Médica",
            description: "Diagnóstico y tratamiento integral del cáncer mediante quimioterapia y fármacos.",
            owner: "Dra. Yessica Marmolejo",
            tasks: [
                { id: 5, name: "Faltan resultados de laboratorio para paciente", status: "Urgente" },
                { id: 6, name: "Actualizar historial clínico digital", status: "Atención" },
            ]
        },
        { 
            id: 3,
            name: "Enfermería",
            description: "Atención directa al paciente, administración de medicamentos y monitoreo continuo.",
            owner: "Dra. Sofía López",
            tasks: [
                { id: 7, name: "Suministro de guantes y mascarillas bajo", status: "Urgente" },
                { id: 8, name: "Capacitación en manejo de bomba de infusión", status: "Pendiente" },
                { id: 9, name: "Revisión de bitácoras de turnos", status: "Atención" },
                { id: 18, name: "Rotación incompleta del personal de turno", status: "Atención" },
                { id: 19, name: "Reportes de administración de medicamentos sin firmar", status: "Urgente "}
            ]
        },
        { 
            id: 4,
            name: "Administración ",
            description: "Gestión de recursos, personal, compras y operaciones internas del hospital.",
            owner: "Dr. Guillermo Salcedo",
            tasks: [
                { id: 10, name: "Falta firmar convenios con proveedores", status: "Pendiente" },
                { id: 11, name: "Solicitudes de pago atrasadas", status: "Urgente" },
                { id: 12, name: "Actualizar directorio institucional", status: "Atención" },
                { id: 13, name: "Falla en equipo de radioterapia", status: "Urgente" },
                { id: 14, name: "Revisión anual de calibración de equipos", status: "Pendiente" },
                { id: 20, name: "Falta enviar reporte mensual al Ministerio de Salud", status: "Urgente" },
                { id: 21, name: "Retrasos en contratación de nuevo personal", status: "Pendiente "}
            ]
        },
        { 
            id: 5,
            name: "Radioterapia ",
            description: "Aplicación de tratamientos con radiación para combatir células cancerosas.",
            owner: "Dr. Pablo Macias",
            tasks: [
                { id: 15, name: "Carga incompleta de expedientes en sistema", status: "Atención" },
                { id: 22, name: "Faltan dosímetros personales en stock", status: "Urgente" },
            ]
        },
        { 
            id: 6,
            name: "Urgencias",
            description: "Atención inmediata a pacientes con condiciones críticas o complicaciones graves.",
            owner: "Dr. Javier Martínez",
            tasks: [
                { id: 1, name: "Falta surtir medicamento de quimioterapia", status: "Urgente" },
                { id: 23, name: "Sesiones de apoyo emocional no agendadas", status: "Pendiente" },
                { id: 24, name: "Informe de evolución psicológica sin actualizar", status: "Atención" },
                { id: 25, name: "Falta desinfección en área de quimioterapia", status: "Urgente "}
            ]
        },
    ];

    const tasksCount = areas.reduce((acc, area) => {
        const urgentTasks = area.tasks.filter(task => task.status === 'Urgente').length;
        const attentionTasks = area.tasks.filter(task => task.status === 'Atención').length;
        const pendingTasks = area.tasks.filter(task => task.status === 'Pendiente').length;

        return {
            urgent: acc.urgent + urgentTasks,
            attention: acc.attention + attentionTasks,
            pending: acc.pending + pendingTasks
        };
    }, { urgent: 0, attention: 0, pending: 0 });
    
    return (
        <Layout>
            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-gray-500">Semaphores</h2>
                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <h3 className="text-sm text-gray-500">Áreas</h3>
                        <b className="text-black">{areas.length}</b>
                    </Card>
                    <Card>
                        <h3 className="text-sm text-gray-500">Tareas urgentes</h3>
                        <b className="text-black">{tasksCount.urgent}</b>
                    </Card>
                    <Card>
                        <h3 className="text-sm text-gray-500">Tareas en atención</h3>
                        <b className="text-black">{tasksCount.attention}</b>
                    </Card>
                    <Card>
                        <h3 className="text-sm text-gray-500">Tareas pendientes</h3>
                        <b className="text-black">{tasksCount.pending}</b>
                    </Card>
                </div>
                <h2 className="text-sm text-gray-500">Áreas</h2>
                <div className="flex flex-wrap gap-4">
                    {areas.map((area) => (
                        <SemaphoreCard key={area.id} semaphore={area} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Semaphores;