import React from "react";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { Activity } from 'lucide-react';
import { BsStoplights } from "react-icons/bs";
import { LuUserRoundCog } from "react-icons/lu";
import { IoLayersOutline } from "react-icons/io5";

const Sidebar = () => {
    const activeStyle = 'text-[#266b6b] bg-[#f1fdfb] rounded-xl';
    const unactiveStyle = 'text-gray-900 hover:text-gray-700';
    return (
        <aside className=" fixed bg-[#feffff] rounded-r-2xl w-[230px] h-svh shadow-lg border border-r-gray-100">
            <nav className="w-full flex flex-col items-center gap-16">
                <div className="flex justify-center items-center pt-8 gap-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-600 rounded-2xl shadow-lg">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800">
                        Portal Médico
                    </h1>
                </div>
                <ul className="flex flex-col w-full">
                    <li className="w-full">
                        <NavLink to="/" className={({ isActive }) => `flex gap-2 w-full py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <GoHome className={({ isActive }) => ` ${isActive ? activeStyle : unactiveStyle}`} size={22}/><span className="font-medium">Inicio</span>
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to="/semaphores" className={({ isActive }) => `flex gap-2 w-full py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <BsStoplights className={({ isActive }) => ` ${isActive ? activeStyle : unactiveStyle}`} size={22} /><span className="font-medium">Semáforos</span>
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to="/areas" className={({ isActive }) => `flex gap-2 w-full py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <IoLayersOutline  className={({ isActive }) => ` ${isActive ? activeStyle : unactiveStyle}`} size={22} /><span className="font-medium">Areas</span>
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink to="/admin" className={({ isActive }) => `flex gap-2 w-full py-2 px-6 ${isActive ? activeStyle : unactiveStyle}`}>
                            <LuUserRoundCog className={({ isActive }) => ` ${isActive ? activeStyle : unactiveStyle}`} size={22} /><span className="font-medium">Admin</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export { Sidebar };