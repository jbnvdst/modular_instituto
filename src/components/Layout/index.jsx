import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import bellIcon from "../../assets/icons/bell.png";
import logoutIcon from "../../assets/icons/exit.png";
import profilePic from "../../assets/img/default_profile.jpg";
import { ModalAlert } from "../../components/ModalAlert";
import { useAuth } from "../../utils/context/AuthContext";
import { HiMenu } from 'react-icons/hi';
import axios from "axios";

const Layout = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const location = useLocation();
    const { user } = useAuth();

    // Obtener notificaciones al montar el componente
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(res.data || []);
            } catch (error) {
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);

    // Filtra las notificaciones del usuario logueado
    const userNotifications = notifications.filter(n => n.userId === user?.id);

    // Calcula si hay no leídas solo para el usuario actual
    const hasUnread = userNotifications.some(n => !n.read);

    const getProfilePictureByToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return profilePic;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.profilePicture) return profilePic;

            // If the URL is already complete (starts with http/https), return as is
            if (payload.profilePicture.startsWith('http://') || payload.profilePicture.startsWith('https://')) {
                return payload.profilePicture;
            }

            // For relative URLs, prepend the API base URL
            return `${import.meta.env.VITE_API_BASE_URL}${payload.profilePicture}`;
        } catch {
            return profilePic;
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
    } else if (location.pathname.startsWith("/demand-forecast")) {
        pageTitle = "Pronóstico Demanda";
    }

    // Limpiar el input de búsqueda al cambiar de ruta
    useEffect(() => {
        setSearchValue("");
    }, [location.pathname]);

    return (
        <div className="flex w-full min-h-screen overflow-x-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="w-full">
                <header className="flex justify-between items-center w-full px-4 md:px-5 md:pl-8 pt-6 md:pt-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <HiMenu size={24} /> 
                        </button>
                        <h3 className="md:ml-[230px] text-xl md:text-3xl font-bold text-gray-800">
                            {pageTitle}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4">
                        <NavLink
                            to="/notification"
                            className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200 relative"
                        >
                            <img src={bellIcon} alt="Notifications" className="w-4 h-4" />
                            {hasUnread && (
                                <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded-full border border-white" 
                                    style={{ top: '-4px', right: '-4px' }}></span>
                            )}
                        </NavLink>
                        <NavLink to="/profile">
                            <img 
                                src={`${getProfilePictureByToken()}`} 
                                alt="Profile" 
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" 
                            />
                        </NavLink>
                        <button
                            className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            <img src={logoutIcon} alt="Logout" className="w-4 h-4" />
                        </button>
                    </div>
                </header>
                
                <main className="md:ml-[230px] px-4 md:px-5 md:pl-8 py-4 pb-20 md:pb-8">
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