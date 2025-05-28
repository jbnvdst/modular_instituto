import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import bellIcon from "../../assets/icons/bell.png";
import logoutIcon from "../../assets/icons/exit.png";
import profilePic from "../../assets/img/default_profile.jpg";
import { ModalAlert } from "../../components/ModalAlert";

const Layout = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const location = useLocation(); // Usar hook de react-router

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
                            <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
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
                            window.location.href = "/login";
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Layout;