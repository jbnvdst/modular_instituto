import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { setsEqual } from 'chart.js/helpers'

function AddTask({ onClick, fetchAlerts }) {
  const initialValues = {
    name: '',
    urgency: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre de la alerta es obligatorio'),
    urgency: Yup.string().oneOf(['urgente', 'atencion', 'pendiente'], 'Selecciona un nivel de urgencia').required('El nivel de urgencia es obligatorio'),
  })

  const handleSubmit = async (values, { resetForm, setSubmitting}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 201) {
        await fetchAlerts?.();
        onClick();
        resetForm();
      } else {
        alert('Error al crear la alerta. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al guardar la alerta. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
    finally{
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Agregar alerta
          </h2>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Nombre de la alerta
                  </label>
                  <Field 
                    name="name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Ingresa el nombre de la alerta"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Nivel de urgencia
                  </label>
                  <Field 
                    as="select"
                    name="urgency"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="urgente">Urgente</option>
                    <option value="atencion">Atención</option>
                    <option value="pendiente">Pendiente</option>
                  </Field>
                  <ErrorMessage 
                    name="urgency" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
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
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export { AddTask }