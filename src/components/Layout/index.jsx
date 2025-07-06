import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import bellIcon from "../../assets/icons/bell.png";
import logoutIcon from "../../assets/icons/exit.png";
import profilePic from "../../assets/img/default_profile.jpg";
import { ModalAlert } from "../../components/ModalAlert";
import { useAuth } from "../../utils/context/AuthContext";

const Layout = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const location = useLocation(); // Usar hook de react-router

    const getProfilePictureByToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return profilePic; // Retorna imagen por defecto si no hay token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.profilePicture ? `http://localhost:4000/${payload.profilePicture}` : profilePic; // Retorna la imagen del perfil si existe, o la imagen por defecto
        } catch {
            return profilePic; // Retorna imagen por defecto si hay un error al decodificar el token
        }
    };

    // Definir los títulos según la ruta
    let pageTitle = "App";
    if (location.pathname === "/" || location.pathname === "/home") {
        pageTitle = "Inicio";
    } else if (location.pathname.startsWith("/semaphores")) {
        pageTitle = "Semáforos";
    } else if (location.pathname.startsWith("/profile")) {
        pageTitle = "Perfil";
    } else if (location.pathname.startsWith("/admin")) {
        pageTitle = "Panel de Administración";
    } else if (location.pathname.startsWith("/notification")) {
        pageTitle = "Notificaciones";
    } else if (location.pathname.startsWith("/areas")) {
        pageTitle = "Gestión de Áreas Asignadas";
    } else if (location.pathname.startsWith("/tasktemplates")) {
        pageTitle = "Plantillas de Tareas";
    } else if (location.pathname.startsWith("/recurringtasks")) {
        pageTitle = "Tareas Recurrentes";
    }

    // Limpiar el input de búsqueda al cambiar de ruta
    useEffect(() => {
        setSearchValue("");
    }, [location.pathname]);

    return (
        <div className="flex w-svw overflow-x-hidden overflow-y-auto">
            <Sidebar />
            <div className="w-full">
                <header className="flex justify-between items-center w-full px-5 pl-8 pt-8">
                    <h3 className="ml-[230px] text-3xl font-bold  text-gray-800">{pageTitle}</h3>
                    <div className="flex items-center gap-4">
                        <input
                            type="search"
                            name="search-no-autofill"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder="Search..."
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            className="text-gray-900 bg-white border border-gray-200 shadow-xs w-72 text-md rounded-sm px-2 py-1"
                        />
                        <NavLink
                            to="/notification"
                            className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
                        >
                            <img src={bellIcon} alt="Notifications" className="w-4 h-4" />
                        </NavLink>
                        <NavLink to="/profile">
                            <img src={`${getProfilePictureByToken()}`} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        </NavLink>
                        <button
                            className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            <img src={logoutIcon} alt="Logout" className="w-4 h-4" />
                        </button>
                    </div>
                </header>
                <main className="ml-[230px] px-5 pl-8">
                    {children}
                </main>
                {showModal && (
                    <ModalAlert
                        title="Cerrar sesión"
                        message="¿Estás seguro de que deseas cerrar sesión?"
                        cancelText="Cancelar"
                        confirmText="Cerrar sesión"
                        onCancel={() => setShowModal(false)}
                        onConfirm={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Layout;