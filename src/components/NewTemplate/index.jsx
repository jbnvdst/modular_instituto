import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAreas } from '../../utils/context/AreasContext'
import { useAuth } from '../../utils/context/AuthContext'
import { TabButton } from '../TabButton'
import { ClipboardPlus, ClipboardList } from 'lucide-react'
import * as Yup from 'yup'
import axios from 'axios'

function NewTemplate({ template, onClose }) {
  const { subAreas, fetchAreas } = useAreas();
  const { fetchTemplates } = useAuth();
  
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
    title: template.title ?? '',
    description: template.description ?? '',
    priority: template.priority ?? 'verde',
    createdBy: getIdFromToken(),
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    priority: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('La prioridad es obligatoria'),
    description: Yup.string(),
  })

  const handleSubmit = async (values, { resetForm }) => {
    // console.log('Valores enviados:', values);
    try {
      // Ajusta la URL según tu API real
      const response = template === 'new' ? 
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/task-template`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      )
      :
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/task-template/${template.id}`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Respuesta del servidor:', response);
      if (response.status === 200 || response.status === 201) {
        await fetchTemplates();
        onClose();
        resetForm();
      } else {
        alert('Error al guardar la plantilla. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al guardar la plantilla. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 onClick={() => console.log(template)} className="text-xl font-semibold text-gray-800 mb-6">
            Crear nueva plantilla de tarea
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
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
                  Descripción (opcional)
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Descripción de la tarea"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Guardar
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
          </Formik>
        </div>
      </div>
    </div>
  )
}

export { NewTemplate }