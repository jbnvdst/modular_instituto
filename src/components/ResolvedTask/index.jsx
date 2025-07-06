import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAreas } from '../../utils/context/AreasContext'
import * as Yup from 'yup'
import axios from 'axios'
import { resolve } from 'chart.js/helpers'

function ResolvedTask({ taskId, onClose = [] }) {
  const {fetchAreas} = useAreas();

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
    resolvedBy: getIdFromToken(),
    comment: '',
  }

  const validationSchema = Yup.object({
    comment: Yup.string(),
  })

  const handleSubmit = async (values, { resetForm }) => {
    // console.log('Valores enviados:', values);
    try {
      // Ajusta la URL según tu API real
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks/resolver/${taskId}`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      // console.log('Respuesta del servidor:', response);
      if (response.status === 200) {
        await fetchAreas();
        onClose();
        resetForm();
      } else {
        alert('Error al resolver la tarea. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al resolver la tarea. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Crear nueva tarea
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Comentario (opcional)
                </label>
                <Field
                  name="comment"
                  as="textarea"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Comentario de la solución"
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
                  Cancelar
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  )
}

export { ResolvedTask }