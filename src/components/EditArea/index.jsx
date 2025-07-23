import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useAreas } from '../../utils/context/AreasContext'

function EditArea({ area, onClick, isCreating, users = [], fetchAreas, directions = [] }) {
  const isEdit = !!area && !!area.id;
  const { areas, setAreas } = useAreas();

  const initialValues = {
    name: area?.name || '',
    description: area?.description || '',
    ownerId: area?.ownerId || '',
    direction: area?.direction || '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    ownerId: Yup.string().required('Selecciona un encargado'),
    direction: Yup.string().required('La dirección es obligatoria'),
  })

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (isEdit) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/area/${area.id}`,
          values,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 200) {
          await fetchAreas();
          onClick();
          resetForm();
        } else {
          alert('Error al editar el área. Por favor, inténtalo de nuevo.');
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/area`,
          values,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          let newArea = response.data;
          newArea.ownerUser = {};
          newArea.ownerUser.name = users.find(user => user.id === newArea.ownerId)?.name || '';
          setAreas([...areas, newArea]);
          onClick();
          resetForm();
        } else {
          alert('Error al crear el área. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) {
      alert('Error al guardar el área. Por favor, inténtalo de nuevo.');
      console.error(error);
    } finally {
      setSubmitting(false); // IMPORTANTE: habilita el botón nuevamente
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isEdit ? 'Editar' : 'Agregar'} área
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
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Nombre del área
                  </label>
                  <Field 
                    name="name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Nombre del área"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Dirección médica
                  </label>
                  <Field 
                    as="select"
                    name="direction"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona una dirección</option>
                    {directions.map(dir => (
                      <option key={dir}>
                        {dir}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="direction" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Descripción
                  </label>
                  <Field 
                    name="description" 
                    as="textarea"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Descripción del área"
                  />
                  <ErrorMessage 
                    name="description" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Encargado del área
                  </label>
                  <Field 
                    as="select"
                    name="ownerId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona un encargado</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="ownerId" 
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
                    {isSubmitting ? (isEdit ? 'Guardando...' : 'Guardando...') : (isEdit ? 'Guardar' : 'Guardar')}
                  </button>
                  <button 
                    type="button" 
                    onClick={onClick} 
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
  )
}

export { EditArea }
