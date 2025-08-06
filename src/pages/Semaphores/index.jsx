import React from "react";
import { LuArrowDownNarrowWide } from "react-icons/lu";
import { useAreas } from "../../utils/context/AreasContext";
import { Card, SemaphoreCard, SemaphoreDetail } from '../../components';
import Layout from "../../components/Layout";

const Semaphores = () => {
    const [selectedArea, setSelectedArea] = React.useState(null);
    const { areas, loadingAreas } = useAreas();
    const [orderByQualification, setOrderByQualification] = React.useState(false);

    const tasksCount = areas.reduce((acc, area) => {
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
            
            <h2 className="text-xs sm:text-sm text-gray-500">Semaphores</h2>
            <hr className="my-3 sm:my-4 border-gray-200"/>
            
            {loadingAreas ? (
                <div className="flex justify-center items-center h-64">
                    <span className="text-gray-500">Cargando áreas...</span>
                </div>
            ) : (
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Cards de estadísticas - Grid Responsive */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Card>
                            <h3 className="text-xs sm:text-sm text-gray-500">Áreas</h3>
                            <b className="text-xl sm:text-2xl text-black">{areas.length}</b>
                        </Card>
                        <Card>
                            <h3 className="text-xs sm:text-sm text-gray-500">Tareas urgentes</h3>
                            <b className="text-xl sm:text-2xl text-black">{tasksCount.urgent}</b>
                        </Card>
                        <Card>
                            <h3 className="text-xs sm:text-sm text-gray-500">Tareas en atención</h3>
                            <b className="text-xl sm:text-2xl text-black">{tasksCount.attention}</b>
                        </Card>
                        <Card>
                            <h3 className="text-xs sm:text-sm text-gray-500">Tareas pendientes</h3>
                            <b className="text-xl sm:text-2xl text-black">{tasksCount.pending}</b>
                        </Card>
                    </div>
                    
                    {/* Sección de Áreas */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Áreas</h2>
                            
                            {/* Botón de ordenar - Responsive */}
                            <button 
                                onClick={() => setOrderByQualification(!orderByQualification)} 
                                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start 
                                         bg-gray-100 px-3 py-2 rounded-lg text-gray-600 
                                         hover:bg-gray-200 transition-colors cursor-pointer
                                         text-sm sm:text-base"
                            >
                                <LuArrowDownNarrowWide className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Ordenar por {orderByQualification ? 'Urgentes' : 'Calificación'}</span>
                            </button>
                        </div>
                        
                        {/* Grid de Semaphore Cards - Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 place-items-center sm:place-items-stretch">
                            {areas.map((area) => (
                                <div key={area.id} className="w-full max-w-[280px] sm:max-w-none">
                                    <SemaphoreCard 
                                        semaphore={area} 
                                        setSelectedArea={setSelectedArea} 
                                        orderByQualification={orderByQualification}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Semaphores;