import React, { createContext, useContext, useState } from "react";

const AreasContext = createContext();

export const useAreas = () => useContext(AreasContext);

export const AreasProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);

  // Obtener áreas (GET)
  const fetchAreas = async () => {
    const res = await fetch("http://localhost:4000/api/area/");
    const data = await res.json();
    setAreas(data);
  };

  // Crear área (POST)
  const createArea = async (area) => {
    const res = await fetch("http://localhost:4000/api/area/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area),
    });
    const newArea = await res.json();
    setAreas((prev) => [...prev, newArea]);
  };

  return (
    <AreasContext.Provider value={{ areas, fetchAreas, createArea }}>
      {children}
    </AreasContext.Provider>
  );
};