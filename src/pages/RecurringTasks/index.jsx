import React, { useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import Layout from "../../components/Layout";
import { FaPlus } from "react-icons/fa6";

const RecurringTasks = () => {
    const { recurringTasks, fetchRecurringTasks } = useAuth();
    const [selectedTask, setSelectedTask] = useState(null);
    
    // React.useEffect(() => {
    //     fetchRecurringTasks();
    // }, [fetchRecurringTasks]);
    
    return (
        <Layout>
            <div className="bg-gray-50 w-full min-h-screen py-6">
                <div className="space-y-6 w-full">
                    <div className="flex justify-between items-center">
                        <h1 onClick={() => console.log(recurringTasks)} className="text-sm text-gray-500">Mis tareas</h1>
                        <button onClick={() => setSelectedTask('new')} className="flex gap-2 items-center px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition duration-200">
                            <FaPlus />
                            <span className="ml-2">Nueva plantilla</span>
                        </button>
                    </div>
                    <hr className="my-4 border-gray-200"/>
                </div>
            </div>
        </Layout>
    );
}

export default RecurringTasks;