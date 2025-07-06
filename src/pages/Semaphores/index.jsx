import React from "react";
import { LuArrowDownNarrowWide } from "react-icons/lu";
import { useAreas } from "../../utils/context/AreasContext";
import { Layout, Card, SemaphoreCard, SemaphoreDetail } from '../../components';


const Semaphores = () => {
    const [selectedArea, setSelectedArea] = React.useState(null);
    const { areas, loadingAreas } = useAreas();
    const [orderByQualification, setOrderByQualification] = React.useState(false);


    const tasksCount = areas.reduce((acc, area) => {
        // console.log(areas);
        const urgentTasks = area.tasks.filter(task => task.priority === 'rojo').length;
        const attentionTasks = area.tasks.filter(task => task.priority === 'amarillo').length;
        const pendingTasks = area.tasks.filter(task => task.priority === 'verde').length;

        return {
            urgent: acc.urgent + urgentTasks,
            attention: acc.attention + attentionTasks,
            pending: acc.pending + pendingTasks
        };
    }, { urgent: 0, attention: 0, pending: 0 });
    
    return (
        <Layout>
            {selectedArea && (
                <SemaphoreDetail semaphore={selectedArea} onClose={setSelectedArea}/>  
            )}
            <h2 className="text-sm text-gray-500">Semaphores</h2>
                <hr className="my-4 border-gray-200"/>
            {loadingAreas ? "Cargando áreas..." :
            <div className="flex flex-col gap-2">
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
                <button onClick={() => setOrderByQualification(!orderByQualification)} className="flex items-center gap-2 w-max bg-gray-100 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
                    <LuArrowDownNarrowWide />
                    <span>Ordenar por {orderByQualification ? 'Urgentes' : 'Calificación'}</span>
                </button>
                <div className="flex flex-wrap gap-4">
                    {areas.map((area) => (
                        <SemaphoreCard key={area.id} semaphore={area} setSelectedArea={setSelectedArea} orderByQualification={orderByQualification}/>
                    ))}
                </div>
            </div>}
        </Layout>
    );
}

export default Semaphores;