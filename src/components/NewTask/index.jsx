import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

function NewTask({ areaId, onClose, users = [], fetchTasks }) {
  const initialValues = {
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    priority: Yup.string().required('Selecciona una prioridad'),
    assignedTo: Yup.string().required('Selecciona un responsable'),
    description: Yup.string(),
  })

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Ajusta la URL según tu API real
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/area/${areaId}/tasks`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 201) {
        if (fetchTasks) await fetchTasks();
        onClose();
        resetForm();
      } else {
        alert('Error al crear la tarea. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al guardar la tarea. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Nueva tarea
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
                  <option value="low">Baja</option>
                  <option value="medium">Normal</option>
                  <option value="high">Urgente</option>
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Asignar a
                </label>
                <Field
                  as="select"
                  name="assignedTo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                >
                  <option value="">Seleccione una persona</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="assignedTo"
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

export { NewTask }