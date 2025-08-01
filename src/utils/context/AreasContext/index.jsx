import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AreasContext = createContext();

export const AreasProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [loadingAreas , setLoadingAreas] = useState(true);

  const fetchAreas = async () => {
    setLoadingAreas(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/area/tasksByArea`);
      setAreas(response.data);
      console.log("Areas fetched:", response.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
    setLoadingAreas(false);
  };

  const fetchSubAreas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sub-area`);
      setSubAreas(response.data);
    } catch (error) {
      console.error("Error fetching subareas:", error);
    }
  };

  const createArea = async (area) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/area/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area),
    });
    const newArea = await res.json();
    setAreas((prev) => [...prev, newArea]);
  };

  useEffect(() => {
    fetchAreas();
    fetchSubAreas();
  }, []);

  return (
    <AreasContext.Provider value={{
      areas,
      setAreas,
      loadingAreas,
      fetchAreas,
      subAreas,
      setSubAreas,
      fetchSubAreas,
      createArea
    }}>
      {children}
    </AreasContext.Provider>
  );
};

export const useAreas = () => useContext(AreasContext);
