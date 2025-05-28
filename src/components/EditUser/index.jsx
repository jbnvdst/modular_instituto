import React, { use } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { SiEightsleep } from 'react-icons/si'

function EditUser({ user, setUsers, onClick }) {
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Email inválido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirma tu contraseña'),
  })

  const handleSubmit = async (values, { resetForm }) => {
  if (values.password !== values.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  const body = {
    name: values.name,
    email: values.email,
    password: values.password,
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 201) {
        const userWithOutPassword = {
          ...response.data.user,
          password: undefined, // Exclude password from the user object
        };
      setUsers((prevUsers) => [...prevUsers, userWithOutPassword]);
      onClick();
      resetForm();
      onClick();
    } else {
      alert('Error al crear el usuario. Por favor, inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    alert('Error al crear el usuario. Por favor, inténtalo de nuevo.');
  }
};


  return (
    <div className='w-[100svw] h-[100svh] flex items-center justify-center fixed top-0 left-0 bg-[#000000A5] z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {user === 0 ? 'Agregar' : 'Editar'} usuario
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
              <label className='block font-semibold'>Contraseña</label>
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