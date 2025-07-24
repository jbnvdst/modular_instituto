import React, { useState, useEffect } from "react";
import { TbReport } from "react-icons/tb";
import { Download } from "lucide-react";
import { CountingCard } from "../../components/CountingCard";
import axios from "axios";
import { saveAs } from 'file-saver';

const GenerateReport = () => {
    const [reportsData, setReportsData] = useState([]);
    const [unreportedAreas, setUnreportedAreas] = useState([]);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const getNextMonth = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth(); // 0-indexed
        let year = date.getFullYear();

        // Si es 20 o más, ir al siguiente mes
        if (day >= 20) {
            month += 1;
            // Si es diciembre, avanzar también el año
            if (month > 11) {
                month = 0;
                year += 1;
            }
        }
        setMonth(month + 1);
        setYear(year);
    }

    const fetchReportData = async () => {
        if (month === null || year === null) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/monthly-reports?month=${month}&year=${year}`);
            console.log(response.data);
            if(response.status === 200) {
                setReportsData(response.data.reports);
                setUnreportedAreas(response.data.unreportedAreas);
            }
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    }

    const handleDownloadReport = (data) => {
        const header = [
            'id',
            'Área',
            '¿Cuál es el problema relevante?',
            '¿Qué originó el problema?',
            'Propuesta y tiempo para solucionarlo',
            'Responsable(s) de la solución',
        ];

        const rows = data.map((report, index) => [
            index + 1,
            report.area?.name || '',
            report.answer1 || '',
            report.answer2 || '',
            report.answer3 || '',
            report.responsible || '',
        ]);

        const csvContent = [header, ...rows]
            .map(row =>
            row
                .map(value =>
                `"${String(value).replace(/"/g, '""')}"` // escape quotes
                )
                .join(',')
            )
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `Reporte_problematicas_${monthNames[month - 1]}_${year}.csv`);
    };

    useEffect(() => {
        getNextMonth();
    }, []);

    useEffect(() => {
        fetchReportData();
    }, [month, year]);

    return (
        <div className="flex w-full flex-col items-center gap-2 mb-8">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-2/3">
                    <h1 className="w-full text-2xl font-bold text-gray-800">Generar Reporte de Problemáticas relevantes</h1>
                    <p className="w-full text-gray-600 mt-1">Verifica cuantas y cuales de las áreas han llenado los datos de su reporte y genera el reporte con los datos existentes</p>
                </div>
                <button onClick={() => handleDownloadReport(reportsData)} className="flex px-2 py-1 border-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:text-teal-500 duration-200">
                    <Download size={20} className="mr-2" />
                    Descargar Reporte
                </button>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <CountingCard title="Reportes generados" count={reportsData.length} icon="ClipboardCheck" />
                    <CountingCard title="Areas sin reportar" count={unreportedAreas.length} icon="ClipboardX" />
                </div>
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Reporte de {monthNames[month - 1]} {year}</h2>
                <h3 className="text-md font-semibold text-gray-800">Áreas reportadas:</h3>
                {reportsData.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {reportsData.map((report) => (
                            <div key={report.id} className="p-4 bg-white shadow-md border-4 border-[#0f787180] rounded-lg">
                                <h3 className="text-md font-semibold text-gray-800">{report.area.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Creado por: {report.answeredBy.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Reportado el: {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500 mt-1">Asignado a: {report.responsible}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay reportes disponibles para este mes.</p>
                )}
                <h3 className="text-md font-semibold text-gray-800">Areas sin reportar:</h3>
                {unreportedAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {unreportedAreas.map((area) => (
                            <div key={area.id} className="p-2 bg-white shadow-md border-4 border-rose-300 rounded-lg">
                                <h3 className="text-md font-semibold text-gray-800">{area.name}</h3>
                                <p className="text-xs text-gray-500">Responsable: {area.ownerUser.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay reportes disponibles para este mes.</p>
                )}
            </div>
        </div>
    );
};

export { GenerateReport };
