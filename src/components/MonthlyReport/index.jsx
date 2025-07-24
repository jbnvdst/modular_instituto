import React, { useEffect, useState } from 'react';
import { TbReport } from 'react-icons/tb';
import { useAuth } from '../../utils/context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const MonthlyReport = ({ report, areaId, fetchReport }) => {
    const { user } = useAuth();
    const [showReport, setShowReport] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState();
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

    useEffect(() => {
        getNextMonth();
    }, []);

    const initialValues = {
        answer1: report?.answer1 || '',
        answer2: report?.answer2 || '',
        answer3: report?.answer3 || '',
        responsible: report?.responsible || '',
    }

    const validationSchema = Yup.object({
        answer1: Yup.string().required('Respuesta 1 es obligatoria'),
        answer2: Yup.string().required('Respuesta 2 es obligatoria'),
        answer3: Yup.string().required('Respuesta 3 es obligatoria'),
        responsible: Yup.string().required('Responsable es obligatorio'),
    })

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
        if (report) {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/monthly-reports/${report.id}`,
                values,
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                await fetchReport();
                setShowReport(false);
            } else {
            alert('Error al editar el reporte. Por favor, inténtalo de nuevo.');
            }
        } else {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/monthly-reports`,
                {
                    ...values,
                    area_id: areaId,
                    answered_by: user.id,
                    month: month,
                    year: year,
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 201) {
                await fetchReport();
                setShowReport(false);
            } else {
            alert('Error al crear el reporte. Por favor, inténtalo de nuevo.');
            }
        }
        } catch (error) {
        alert('Error al guardar el reporte. Por favor, inténtalo de nuevo.');
        console.error(error);
        } finally {
            setSubmitting(false); // IMPORTANTE: habilita el botón nuevamente
        }
    };

    return (
        <div className={`flex flex-col justify-center items-center gap-2 bg-white border-4 ${report ? 'border-[#0f787180]' : 'border-rose-300'} shadow-md rounded-2xl p-4`}>
            <h1 className="w-full text-gray-800 font-bold text-lg">Reporte mensual del área</h1>
            <div className="flex flex-col items-center gap-2">
                <TbReport className="text-4xl text-[#0f787195]" />
                <button onClick={() => setShowReport(true)} className="bg-[#0f7871] text-white rounded-md px-4 py-2 cursor-pointer hover:bg-[#0f7871d7]">{report ? 'Ver reporte' : 'Generar reporte'}</button>
            </div>
            {report ? <p className="text-center">Felicidades! Tu reporte mensual ha sido enviado, si deseas revisarlo o modificarlo consúltalo en este botón</p>
                :
                <p className="text-center">Recuerda que tienes hasta el 5 de {monthNames[month - 1]} para generar el reporte mensual de tu área.</p>
            }
            {showReport && (
                <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                {report ? 'Modificar' : 'Crear'} reporte mensual
                            </h2>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <h1 className='text-gray-800 font-bold text-lg'>Problemáticas relevantes</h1>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            ¿Cuál es el problema relevante?
                                        </label>
                                        <Field
                                            name="answer1" 
                                            as="textarea"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            placeholder="Escribe aqui tu respuesta"
                                        />
                                        <ErrorMessage 
                                            name="answer1" 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            ¿Qué originó el problema?
                                        </label>
                                        <Field
                                            name="answer2" 
                                            as="textarea"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            placeholder="Escribe aqui tu respuesta"
                                        />
                                        <ErrorMessage 
                                            name="answer2" 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Propuesta y tiempo para solucionarlo
                                        </label>
                                        <Field
                                            name="answer3" 
                                            as="textarea"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            placeholder="Escribe aqui tu respuesta"
                                        />
                                        <ErrorMessage 
                                            name="answer3" 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Responsable(s) de la solución
                                        </label>
                                        <Field
                                            name="responsible"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            placeholder="Escribe aqui tu respuesta"
                                        />
                                        <ErrorMessage 
                                            name="responsible" 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}  // Desactiva mientras envía
                                            className={`bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-teal-700
                                                ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                            `}
                                        >
                                            {isSubmitting ? (report ? 'Guardando...' : 'Guardando...') : 'Guardar'}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowReport(false)} 
                                            className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                                            disabled={isSubmitting} // Opcional: bloquear cerrar mientras envía
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </Form>
                            )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
    export { MonthlyReport };