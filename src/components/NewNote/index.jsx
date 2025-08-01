import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const statusOptions = [
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'pendiente', label: 'Pendiente' },
]

function NewNote({ onClose, onSave }) {
  const initialValues = {
    nombre: '',
    numeroOficio: '', 
    estatus: 'default',
    descripcion: '',
  }

  const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    numeroOficio: Yup.string()
      .required('El número de oficio es obligatorio')
      .matches(/^\d+$/, 'Solo se permiten dígitos'),
    estatus: Yup.string().notOneOf(["default"], "Debes seleccionar una opción válida").required('El estatus es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
  })

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (onSave) {
        await onSave(values)
      }
      resetForm()
      if (onClose) onClose()
    } catch (error) {
      console.error('Error al guardar la nota:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-6">
            Crear nueva nota
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
                    Nombre de la nota
                  </label>
                  <Field
                    name="nombre"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Nombre de la nota"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                    Número de oficio
                  </label>
                  <Field
                    name="numeroOficio"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Número de oficio"
                  />
                  <ErrorMessage
                    name="numeroOficio"
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
                    name="estatus"
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
                    name="estatus"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                    Descripción del oficio
                  </label>
                  <Field
                    name="descripcion"
                    as="textarea"
                    rows={2}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Descripción del oficio"
                  />
                  <ErrorMessage
                    name="descripcion"
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

export { NewNote }