import React from "react";
import { useAuth } from "../../utils/context/AuthContext";
import { Request } from "../../components";

const RequestsList = ({ areaId }) => {
  const { requests } = useAuth();

  // Arreglo seguro y sin nulls
  const all = Array.isArray(requests) ? requests.filter(Boolean) : [];

  // Si pasas areaId, filtramos por esa área (soporta distintas formas de venir el id)
  const list = all.filter((r) => {
    if (!areaId) return true;
    const reqAreaId =
      r?.areaId ??
      r?.area?.id ??
      r?.involvedArea ??
      r?.involved_area_id ??
      r?.area_id;
    return reqAreaId === areaId;
  });

  if (!areaId) {
    return (
      <div className="text-gray-500 text-sm">
        Selecciona un área para ver solicitudes.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-2">
            {list.map((req, idx) => (
              <Request key={req?.id ?? idx} request={req} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No hay solicitudes para esta área.</div>
      )}
    </div>
  );
};

export { RequestsList };
