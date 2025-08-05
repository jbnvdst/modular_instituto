import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useAuth } from '../../utils/context/AuthContext'

const statusOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Resuelto', label: 'Resuelto' },
]

function NewRequest({ onClose, areaId }) {
    const { fetchRequests, getIdFromToken } = useAuth();

  const initialValues = {
    title: '',
    status: 'Pendiente',
    description: '',
    areaId: areaId,
    createdBy: getIdFromToken(),
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('El nombre es obligatorio'),
    status: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('El estatus es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
  })

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/requests`, values,
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
            fetchRequests(); // Assuming fetchRequests is a function to refresh the request list
            resetForm();
            if (onClose) onClose();
        }
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        alert('Error al crear la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-6">
            Crear nueva solicitud
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-2 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                    Título
                  </label>
                  <Field
                    name="title"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Titulo de la solicitud"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                    Estatus
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  >
                    <option value="default">Seleccione un estatus</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                    Descripción de la solicitud
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    rows={2}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Descripción de la solicitud"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
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
                    Cancelar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export { NewRequest }