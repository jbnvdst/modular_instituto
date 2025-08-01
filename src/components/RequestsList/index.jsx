import React from "react";
import { useAuth } from "../../utils/context/AuthContext";
import { Request } from "../../components";

const RequestsList = () => {
    const { requests } = useAuth();

    return (
        <div className="space-y-3">
            {requests?.length > 0 ? (
                <div className="overflow-x-auto">
                    <div className="flex flex-col gap-2">
                        {requests.map((req) => (
                            <Request key={req.id} request={req} />
                        ))}
                    </div>
                </div>
            ) : (
            <div className="text-gray-500">No hay personal asignado a esta área.</div>
            )}
        </div>
    )
}

export { RequestsList };