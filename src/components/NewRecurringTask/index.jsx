import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAreas } from '../../utils/context/AreasContext'
import { useAuth } from '../../utils/context/AuthContext'
import { TabButton } from '../TabButton'
import { ClipboardPlus, ClipboardList } from 'lucide-react'
import * as Yup from 'yup'
import axios from 'axios'

function NewRecurringTask({ task, onClose }) {
  const { subAreas } = useAreas();
  const { fetchRecurringTasks, taskTemplates } = useAuth();
  const [activeTab, setActiveTab] = React.useState('new');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [areas, setAreas] = useState([]);
  
  const getIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || null;
    } catch {
        return null;
    }
  }

  const initialValues = {
    title: task.title ?? '',
    description: task.description ?? '',
    priority: task.priority ?? 'verde',
    frequency: task.frequency ?? 'daily',
    interval: task.interval ?? 1,
    startDate: task.startDate ?? '',
    endDate: task.endDate ?? '',
    createdBy: getIdFromToken(),
    areaId: task !== 'new' ? task.area.id : 'default',
    subAreaId: task !== 'new' ? task.subArea : 'default',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    priority: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('La prioridad es obligatoria'),
    frequency: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('La frecuencia es obligatoria'),
    interval: Yup.number().min(1, 'El intervalo debe ser al menos 1').required('El intervalo es obligatorio'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    areaId: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('El área es obligatoria'),
    subAreaId: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('El área de necesidad es obligatoria'),
    description: Yup.string(),
  })

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/area/byUser/${getIdFromToken()}`);
                if (response.status === 200) {
                    setAreas(response.data);
                } else {
                    alert('Error al cargar las áreas. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error al cargar las áreas:', error);
                alert('Error al cargar las áreas. Por favor, inténtalo de nuevo.');
            }
        }
        fetchAreas();
    }, []);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // console.log('Valores enviados:', values);
    console.log('Valores enviados:', values);
    const dataToSend = {
        ...values,
        endDate: values.endDate === '' ? null : values.endDate
    }
    try {
      // Ajusta la URL según tu API real
      const response = task === 'new' ? 
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/recurring-tasks`,
        dataToSend,
        { headers: { 'Content-Type': 'application/json' } }
      )
      :
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/recurring-tasks/${task.id}`,
        dataToSend,
        { headers: { 'Content-Type': 'application/json' } }
      );
    //   console.log('Respuesta del servidor:', response);
      if (response.status === 200 || response.status === 201) {
        await fetchRecurringTasks();
        onClose();
        resetForm();
      } else {
        alert('Error al guardar la tarea. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al guardar la tarea. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
            <div className="flex space-x-1 mb-2 bg-gray-100 p-1 rounded-lg w-fit">
                <TabButton 
                    id="new" 
                    label="Nueva Tarea" 
                    icon={ClipboardPlus}
                    isActive={activeTab === 'new'} 
                    onClick={() => setActiveTab('new')} 
                />
                <TabButton 
                    id="recurrent" 
                    label="Recurrente" 
                    icon={ClipboardList}
                    isActive={activeTab === 'recurrent'} 
                    onClick={() => setActiveTab('recurrent')} 
                />
            </div>
            {activeTab === 'recurrent' && (
            <select onChange={(e) => setSelectedTemplate(e.target.value === 'default' ? null : JSON.parse(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors mb-4">
                <option value="default">Selecciona una plantilla</option>
                {taskTemplates.map(template => (
                <option key={template.id} value={JSON.stringify(template)}>
                    {template.title}
                </option>
                ))}
            </select>
            )}
          <h2 onClick={() => console.log(task)} className="text-xl font-semibold text-gray-800 mb-6">
            Crear nueva tarea recurrente
          </h2>
          <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setValues, values, isSubmitting }) => {
                useEffect(() => {
                    if (selectedTemplate !== null) {
                    setValues({
                        ...values,
                        title: selectedTemplate.title,
                        description: selectedTemplate.description,
                        priority: selectedTemplate.priority,
                        subAreaId: selectedTemplate.subAreaId || 'default',
                    });
                    } else {
                    setValues(initialValues);
                    }
                }, [selectedTemplate]);

                return (
                    <Form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Título de la tarea
                        </label>
                        <Field
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="Título de la tarea"
                        />
                        <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Prioridad
                        </label>
                        <Field
                        as="select"
                        name="priority"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        >
                        <option value="default">Seleccione una prioridad</option>
                        <option value="verde">Pendiente</option>
                        <option value="amarillo">Atención</option>
                        <option value="rojo">Urgente</option>
                        </Field>
                        <ErrorMessage
                        name="priority"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Área
                        </label>
                        <Field
                        as="select"
                        name="areaId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        >
                        <option value="default">Seleccione un área</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>
                            {area.name}
                            </option>
                        ))}
                        </Field>
                        <ErrorMessage
                        name="subAreaId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Área de necesidad
                        </label>
                        <Field
                        as="select"
                        name="subAreaId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        >
                        <option value="default">Seleccione un área</option>
                        {subAreas.map(sub => (
                            <option key={sub.id} value={sub.id}>
                            {sub.name}
                            </option>
                        ))}
                        </Field>
                        <ErrorMessage
                        name="subAreaId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Descripción (opcional)
                        </label>
                        <Field
                        name="description"
                        as="textarea"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="Descripción de la tarea"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Frecuencia
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Cada</span>
                            <Field
                                name="interval"
                                type="number"
                                className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                placeholder="1"
                            />
                            <Field
                                as="select"
                                name="frequency"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            >
                                <option value="default">Seleccione un área</option>
                                <option value="daily">Día(s)</option>
                                <option value="weekly">Semana(s)</option>
                                <option value="monthly">Mes(es)</option>
                            </Field>
                        </div>
                        <ErrorMessage
                        name="subAreaId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        A partir del
                        </label>
                        <Field
                        name="startDate"
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="Descripción de la tarea"
                        />
                    </div>
                        <ErrorMessage
                        name="startDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                        Hasta el
                        </label>
                        <Field
                        name="endDate"
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="Descripción de la tarea"
                        />
                    </div>
                        <ErrorMessage
                        name="endDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        />
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                    </Form>
                )
                }}
            </Formik>
        </div>
      </div>
    </div>
  )
}

export { NewRecurringTask }