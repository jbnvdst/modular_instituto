import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function ExportReporteTareas(tareas) {
  
    if (!tareas || tareas.length === 0) {
    alert("No hay tareas para exportar");
    return;
  }

  // Función para agrupar y contar por campo
  const contarPorCampo = (arr, campo) => {
    // console.log("Tareas recibidas:", tareas); 
    return arr.reduce((acc, item) => {
      // Para campos anidados o nombres distintos, ajusta aquí
      let key = item[campo];
      if (campo === "area") key = item.Area?.name || "Desconocido";
      if (campo === "createdBy") key = item.creator?.name || "Desconocido";
      if (campo === "resolvedBy") key = item.resolvedByName || "Desconocido";
      if (!key) key = "Desconocido";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  // 1. Todas las tareas (datos planos)
    const hojaTodas = tareas.map(t => ({
        Título: t.title || "",
        Descripción: t.description || "",
        Prioridad: t.priority || "",
        Estado: t.resolvedAt ? "Resuelto" : "Pendiente",
        "Fecha de creación": t.createdAt || "",
        "Fecha de resolución": t.resolvedAt || "",
        "Última actualización": t.updatedAt || "",
        Comentario: t.comment || "",
        Creador: t.createdBy || "Desconocido",
        "ID Creador": t.createdBy || "",
        "Resuelto por": t.resolvedBy || "Pendiente",
        "ID Resolutor": t.resolvedBy || "",
        Área: t.areaId || "Desconocido",
        "ID Área": t.areaId || "",
        Subárea: t.subAreaId || "Desconocido",
        "ID Subárea": t.subAreaId || "",
    }));

  // 2. Tareas por creador
  const tareasPorCreador = contarPorCampo(tareas, "createdBy");
  const hojaCreador = Object.entries(tareasPorCreador).map(([creador, count]) => ({
    Creador: creador,
    "Cantidad de tareas creadas": count,
  }));

  // 3. Tareas resueltas por usuario (contar resolvedByName)
  const tareasResueltasPor = contarPorCampo(
    tareas.filter(t => t.resolvedAt),
    "resolvedBy"
  );
  const hojaResueltas = Object.entries(tareasResueltasPor).map(([usuario, count]) => ({
    Usuario: usuario,
    "Cantidad de tareas resueltas": count,
  }));

  // 4. Tareas por prioridad
  const tareasPorPrioridad = contarPorCampo(tareas, "priority");
  const hojaPrioridad = Object.entries(tareasPorPrioridad).map(([prioridad, count]) => ({
    Prioridad: prioridad,
    "Cantidad de tareas": count,
  }));

  // 5. Tareas por área
  const tareasPorArea = contarPorCampo(tareas, "area");
  const hojaArea = Object.entries(tareasPorArea).map(([area, count]) => ({
    Área: area,
    "Cantidad de tareas": count,
  }));

  // 6. Tareas por estado (Resuelta, Pendiente)
  const tareasPorEstado = {
    Resuelta: tareas.filter(t => t.resolvedAt).length,
    Pendiente: tareas.filter(t => !t.resolvedAt).length,
  };
  const hojaEstado = Object.entries(tareasPorEstado).map(([estado, count]) => ({
    Estado: estado,
    "Cantidad de tareas": count,
  }));

  // Crear libro y hojas
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaTodas), "Todas las tareas");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaCreador), "Tareas por creador");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaResueltas), "Tareas resueltas por");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaPrioridad), "Tareas por prioridad");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaArea), "Tareas por área");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaEstado), "Tareas por estado");

  // Generar archivo y descargar
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Reporte_Tareas_30_Dias_Extendido.xlsx");
}
