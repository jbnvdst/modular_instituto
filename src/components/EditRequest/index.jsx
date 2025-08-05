import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAreas } from '../../utils/context/AreasContext'
import * as Yup from 'yup'
import axios from 'axios'
import { useAuth } from '../../utils/context/AuthContext'

function EditRequest({ request }) {
  const { fetchRequests } = useAuth();

  const initialValues = {
    status: request.status,
    comment: request.comment,
  }

  const validationSchema = Yup.object({
    status: Yup.string().required('El estatus es requerido'),
    comment: Yup.string(),
  })

  const handleSubmit = async (values, { resetForm }) => {
    // console.log('Valores enviados:', values);
    try {
      // Ajusta la URL según tu API real
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/request-status/${request.id}`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      // console.log('Respuesta del servidor:', response);
      if (response.status === 200) {
        await fetchRequests();
        // onClose();
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
        <div className="p-2">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
            {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2">
                <div className='flex gap-2 items-center'>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                            Estatus
                        </label>
                        <Field
                            name="status"
                            as="select"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="Comentario de la solución"
                        >
                            <option value="">Seleccionar estatus</option>
                            <option value="Leído">Leído</option>
                            <option value="En progreso">En Progreso</option>
                            <option value="Completado">Resuelto</option>
                        </Field>
                        <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
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
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
            </Form>
            )}
            </Formik>
        </div>
  )
}

export { EditRequest }