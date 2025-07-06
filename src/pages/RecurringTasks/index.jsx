import React from "react";
import { useAuth } from "../../utils/context/AuthContext";
import Layout from "../../components/Layout";

const RecurringTasks = () => {
    const { recurringTasks, fetchRecurringTasks } = useAuth();
    
    // React.useEffect(() => {
    //     fetchRecurringTasks();
    // }, [fetchRecurringTasks]);
    
    return (
        <Layout>
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Tareas Recurrentes</h2>
                <div className="space-y-4">
                    {/* {recurringTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                    </div>
                    ))} */}
                </div>
            </div>
        </Layout>
    );
}

export default RecurringTasks;