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
    <div className='w-[100svw] h-[100svh] flex items-center justify-center fixed top-0 left-0 bg-[#000000A5] z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {isEdit ? 'Editar' : 'Agregar'} usuario
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form className='flex flex-col gap-4 mt-4'>
            <div>
              <label className='block font-semibold'>Nombre</label>
              <Field name='name' className='border rounded px-2 py-1 w-full' />
              <ErrorMessage name='name' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block font-semibold'>Email</label>
              <Field name='email' type='email' className='border rounded px-2 py-1 w-full' />
              <ErrorMessage name='email' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block font-semibold'>Contraseña {isEdit && <span className="text-xs text-gray-400">(dejar vacío para no cambiar)</span>}</label>
              <Field name='password' type='password' className='border rounded px-2 py-1 w-full' />
              <ErrorMessage name='password' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block font-semibold'>Confirmar contraseña</label>
              <Field name='confirmPassword' type='password' className='border rounded px-2 py-1 w-full' />
              <ErrorMessage name='confirmPassword' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='flex justify-between mt-4'>
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
                Guardar
              </button>
              <button type='button' onClick={onClick} className='bg-gray-300 px-4 py-2 rounded'>
                Cerrar
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export { EditUser }