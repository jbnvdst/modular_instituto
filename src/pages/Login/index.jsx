import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <input type="text" placeholder="Usuario"/>
        <input type="password" placeholder="Contraseña"/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;