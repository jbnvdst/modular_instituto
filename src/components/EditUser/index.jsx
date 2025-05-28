import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

function EditUser({ user, setUsers, onClick, fetchUsers }) {
  const isEdit = !!user && !!user.id;

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Email inválido').required('El email es obligatorio'),
    password: isEdit
      ? Yup.string()
      : Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria'),
    confirmPassword: isEdit
      ? Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      : Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Confirma tu contraseña'),
  })

  const handleSubmit = async (values, { resetForm }) => {
    if (values.password !== values.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const body = {
      name: values.name,
      email: values.email,
      ...(values.password ? { password: values.password } : {}),
    };

    try {
      if (isEdit) {
        // EDITAR USUARIO
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/update/${user.id}`,
          body,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 200) {
          await fetchUsers();
          onClick();
          resetForm();
        } else {
          alert('Error al editar el usuario. Por favor, inténtalo de nuevo.');
        }
      } else {
        // CREAR USUARIO
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
          body,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          await fetchUsers();
          onClick();
          resetForm();
        } else {
          alert('Error al crear el usuario. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) {
      alert('Error al guardar el usuario. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000A8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isEdit ? 'Editar' : 'Agregar'} usuario
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
                  Email
                </label>
                <Field 
                  name="email" 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="ejemplo@correo.com"
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Contraseña {isEdit && <span className="text-xs text-gray-400">(dejar vacío para no cambiar)</span>}
                </label>
                <Field 
                  name="password" 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Nueva contraseña"
                />
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Confirmar contraseña
                </label>
                <Field 
                  name="confirmPassword" 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  placeholder="Confirma tu contraseña"
                />
                <ErrorMessage 
                  name="confirmPassword" 
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

export { EditUser }