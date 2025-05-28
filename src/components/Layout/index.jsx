import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import bellIcon from "../../assets/icons/bell.png";
import logoutIcon from "../../assets/icons/exit.png";
import profilePic from "../../assets/img/default_profile.jpg";

const Layout = ({ children }) => {
    const [showModal, setShowModal] = React.useState(false);

    // Obtener la ruta actual
    const location = window.location.pathname;

    // Definir los títulos según la ruta
    let pageTitle = "App";
    if (location === "/" || location === "/home") {
        pageTitle = "Inicio";
    } else if (location.startsWith("/semaphores")) {
        pageTitle = "Semáforos";
    } else if (location.startsWith("/profile")) {
        pageTitle = "Perfil";
    } else if (location.startsWith("/admin")) {
        pageTitle = "Panel de Administración";
    }

    return (
        <div className="flex w-svw overflow-x-hidden overflow-y-auto">
            <Sidebar />
            <div className="w-full">
                <header className="flex justify-between items-center w-full px-5 pl-8 pt-8">
                    <h3 className="ml-[230px] text-3xl font-bold  text-gray-800">{pageTitle}</h3>
                    <div className="flex items-center gap-4">
                        <input type="text" placeholder="Search..." className="text-gray-900 bg-white border border-gray-200 shadow-xs w-72 text-md rounded-sm px-2 py-1" />
                        <button className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200">
                            <img src={bellIcon} alt="Notifications" className="w-4 h-4" />
                        </button>
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
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">¿Seguro que quieres cerrar sesión?</h2>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <a
                                    href="/login"
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Sí, cerrar sesión
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export { Layout };