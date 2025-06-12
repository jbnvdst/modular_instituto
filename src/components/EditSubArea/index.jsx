import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

function EditSubArea({ subArea, setSubAreas, onClick, fetchSubAreas }) {
  const isEdit = !!subArea && !!subArea.id;

  const initialValues = {
    name: subArea?.name || '',
    description: subArea?.description || '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
  })

  const handleSubmit = async (values, { resetForm }) => {
    const body = {
      name: values.name,
      description: values.description,
    };

    try {
      if (isEdit) {  
        // EDITAR SUBAREA
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/sub-area/${subArea.id}`,
          body,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 200) {
          await fetchSubAreas();
          onClick();
          resetForm();
        } else {
          alert('Error al editar el subarea. Por favor, inténtalo de nuevo.');
        }
      } else {
        // CREAR SUBAREA
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/sub-area/`,
          body,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          await fetchSubAreas();
          onClick();
          resetForm();
        } else {
          alert('Error al crear el subarea. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) {
      alert('Error al guardar el subarea. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isEdit ? 'Editar' : 'Agregar'} subárea
          </h2>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Nombre
                </label>
                <Field 
                  name="name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Ingresa tu nombre"
                />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  descripción
                </label>
                <Field 
                  name="description" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Ingresa tu nombre"
                />
                <ErrorMessage 
                  name="description" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
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
                  onClick={onClick} 
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

export { EditSubArea }