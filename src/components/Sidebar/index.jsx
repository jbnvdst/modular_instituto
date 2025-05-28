import React from "react";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BsStoplights } from "react-icons/bs";
import { LuUserRoundCog } from "react-icons/lu";

const Sidebar = () => {
    const activeStyle = 'text-[#266b6b] bg-[#f1fdfb] rounded-xl';
    const unactiveStyle = 'text-gray-900 hover:text-gray-700';
    return (
        <aside className=" fixed bg-[#feffff] rounded-r-2xl w-[230px] h-svh shadow-lg border border-r-gray-100">
            <nav className="w-full flex flex-col items-center gap-16">
                <h1 className="text-gray-900 font-semibold text-lg p-8">App Logo</h1>
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