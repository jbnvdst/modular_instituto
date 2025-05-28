import React, { createContext, useContext, useState, useEffect } from "react";

const AreasContext = createContext();

export const useAreas = () => useContext(AreasContext);

export const AreasProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);

  // Obtener áreas (GET)
  const fetchAreas = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/area/`);
    const data = await res.json();
    console.log("Respuesta de la API de áreas:", data); // <-- AGREGA ESTA LÍNEA
    setAreas(Array.isArray(data) ? data : data.areas || []);
  };

  // Crear área (POST)
  const createArea = async (area) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/area/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area),
    });
    const newArea = await res.json();
    setAreas((prev) => [...prev, newArea]);
  };

  // <--- AGREGA ESTE useEffect
  useEffect(() => {
    fetchAreas();
  }, []);
  // --->

  return (
    <AreasContext.Provider value={{ areas, fetchAreas, createArea }}>
      {children}
    </AreasContext.Provider>
  );
};