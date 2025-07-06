import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function ExportReporteTareas(tareas) {
  const creadosPor = {}
  const resueltosPor = {}
  const porPrioridad = {}
  const porArea = {}

  tareas.forEach((tarea) => {
    const creador = tarea.creator?.name || 'Desconocido'
    const resolutor = tarea.resolvedBy ? tarea.creator?.name : null
    const prioridad = tarea.priority || 'Sin prioridad'
    const area = tarea.Area?.name || 'Sin área'
    const subArea = tarea.subArea?.name || 'Sin subárea'

    creadosPor[creador] = (creadosPor[creador] || 0) + 1
    if (resolutor) {
      resueltosPor[resolutor] = (resueltosPor[resolutor] || 0) + 1
    }

    porPrioridad[prioridad] = (porPrioridad[prioridad] || 0) + 1
    const areaKey = `${area} - ${subArea}`
    porArea[areaKey] = (porArea[areaKey] || 0) + 1
  })

  const resumen = [
    { métrica: 'Total tareas', valor: tareas.length },
    { métrica: 'Tareas resueltas', valor: tareas.filter(t => t.resolvedAt).length },
    { métrica: 'Tareas pendientes', valor: tareas.filter(t => !t.resolvedAt).length },
  ]

  const creados = Object.entries(creadosPor).map(([nombre, cantidad]) => ({
    nombre,
    tareasCreadas: cantidad,
  }))

  const resueltos = Object.entries(resueltosPor).map(([nombre, cantidad]) => ({
    nombre,
    tareasResueltas: cantidad,
  }))

  const prioridades = Object.entries(porPrioridad).map(([nivel, cantidad]) => ({
    prioridad: nivel,
    total: cantidad,
  }))

  const areas = Object.entries(porArea).map(([ubicacion, cantidad]) => ({
    areaYSubarea: ubicacion,
    total: cantidad,
  }))

  const detalle = tareas.map(t => ({
    id: t.id,
    título: t.title,
    descripción: t.description,
    prioridad: t.priority,
    área: t.Area?.name,
    subárea: t.subArea?.name,
    creador: t.creator?.name,
    creadoEn: t.createdAt,
    resueltoEn: t.resolvedAt || 'No resuelto',
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), 'Resumen')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(creados), 'Creados por')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resueltos), 'Resueltos por')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prioridades), 'Por prioridad')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(areas), 'Por área')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detalle), 'Detalle')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  saveAs(blob, 'reporte_tareas.xlsx')
}
