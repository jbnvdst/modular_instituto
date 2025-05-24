import React from "react";
import { NavLink } from "react-router-dom";
import adminIcon from "../../assets/icons/admin.png";
import semaphoreIcon from "../../assets/icons/semaphore.png";
import homeIcon from "../../assets/icons/home.png";

const Sidebar = () => {
    const activeStyle = 'text-blue-400';
    const unactiveStyle = 'text-gray-900 hover:text-gray-700';
    return (
        <aside className="bg-gray-200 rounded-2xl w-[248px] h-svh">
            <nav className="w-full flex flex-col items-center gap-16">
                <h1 className="text-gray-900 font-medium text-lg p-10">App Logo</h1>
                <ul className="flex flex-col w-full">
                    <li className="w-full">
                        <NavLink to="/" className={({ isActive }) => `flex gap-2 w-full bg-gray-200 py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <img src={homeIcon} className="w-5 h-5"/><span className="font-medium">Inicio</span>
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to="/semaphores" className={({ isActive }) => `flex gap-2 w-full bg-gray-200 py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <img src={semaphoreIcon} className="w-5 h-5"/><span className="font-medium">Semáforos</span>
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to="/profile" className={({ isActive }) => `flex gap-2 w-full bg-gray-200 py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <img src={adminIcon} className="w-5 h-5"/><span className="font-medium">Admin</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export { Sidebar };