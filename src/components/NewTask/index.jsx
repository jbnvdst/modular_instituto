import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAreas } from '../../utils/context/AreasContext'
import { useAuth } from '../../utils/context/AuthContext'
import { TabButton } from '../TabButton'
import { ClipboardPlus, ClipboardList } from 'lucide-react'
import * as Yup from 'yup'
import axios from 'axios'

function NewTask({ areaId, onClose, users = [] }) {
  const { subAreas, fetchAreas,areas } = useAreas();
  const { taskTemplates } = useAuth();
  const [activeTab, setActiveTab] = React.useState('new');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  
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
    title: '',
    description: '',
    priority: 'default',
    subAreaId: 'default',
    createdBy: getIdFromToken(),
    areaId: areaId,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    priority: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('La prioridade es obligatoria'),
    subAreaId: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('El area de necesidad es obligatoria'),
    description: Yup.string(),
  })

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
  try {
    const payload = {
      ...values,
      resolvedAt: null
    };

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/tasks`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("✅ Tarea creada:", response.data);
    

    if (response.status === 200 || response.status === 201) {
          resetForm();
          onClose();
          fetchAreas(); // Refresh areas after creating a task
        } else {
          alert('La tarea no se pudo crear correctamente.');
        }
      } catch (error) {
        console.error("❌ Error al crear la tarea:", error.response?.data || error);
        alert('Error al crear la tarea.');
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          <div className="flex space-x-1 mb-2 sm:mb-2 bg-gray-100 p-1 rounded-lg w-fit">
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
            <select 
              onChange={(e) => setSelectedTemplate(e.target.value === 'default' ? null : JSON.parse(e.target.value))} 
              className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors mb-2 sm:mb-4"
            >
              <option value="default">Selecciona una plantilla</option>
              {taskTemplates.map(template => (
                <option key={template.id} value={JSON.stringify(template)}>
                  {template.title}
                </option>
              ))}
            </select>
          )}
          <h2  className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-6">
            Crear nueva tarea
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
                <Form className="space-y-2 sm:space-y-4">
                  <div>
                    <label  className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Título de la tarea
                    </label>
                    <Field
                      name="title"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Título de la tarea"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label onClick={() => (console.log(areas))} className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Solicitar a:
                    </label>
                    <Field
                      as="select"
                      name="requestedTo"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    >
                      <option value="default">Seleccione una área</option>
                      {areas.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="requestedTo"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Prioridad
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    >
                      <option value="default">Seleccione una prioridad</option>
                      <option value="verde">Pendiente</option>
                      <option value="amarillo">Atención</option>
                      <option value="rojo">Urgente</option>
                    </Field>
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Área de necesidad
                    </label>
                    <Field
                      as="select"
                      name="subAreaId"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
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
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Descripción (opcional)
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      rows="2"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Descripción de la tarea"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-base font-medium transition-colors"
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-base font-medium transition-colors"
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

export { NewTask }