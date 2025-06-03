import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AreasContext = createContext();

export const AreasProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);
  const [ loadingAreas , setLoadingAreas ] = useState(true);

  const fetchAreas = async () => {
    console.log("Fetching areas...");
    setLoadingAreas(true);
    try {
        const reponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/area/tasksByArea`);
        // console.log("Areas fetched:", reponse.data);
        setAreas(reponse.data);
    } catch (error) {
        // console.error("Error fetching areas:", error);
    }
    setLoadingAreas(false);
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
    <AreasContext.Provider value={{ areas, setAreas, loadingAreas ,fetchAreas, createArea }}>
      {children}
    </AreasContext.Provider>
  );
};


export const useAreas = () => useContext(AreasContext);
