import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import bellIcon from "../../assets/icons/bell.png";
import logoutIcon from "../../assets/icons/exit.png";
import profilePic from "../../assets/img/default_profile.jpg";

const Layout = ({ children }) => {
    return (
        <div className="flex w-svw overflow-x-hidden overflow-y-auto">
            <Sidebar />
            <div className="w-full">
                <header className="flex justify-between items-center w-full px-5 pl-8 pt-8">
                    <h3 className="text-3xl font-bold  text-gray-800">App</h3>
                    <div className="flex items-center gap-4">
                        <input type="text" placeholder="Search..." className="text-gray-900 bg-white border border-gray-200 shadow-xs w-72 text-md rounded-sm px-2 py-1" />
                        <button className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200">
                            <img src={bellIcon} alt="Notifications" className="w-4 h-4" />
                        </button>
                        <NavLink to="/profile">
                            <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        </NavLink>
                        <button className="bg-white border border-gray-200 shadow-xs p-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-all duration-200">
                            <img src={logoutIcon} alt="Notifications" className="w-4 h-4" />
                        </button>
                    </div>
                </header>
                <main className="px-5 pl-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export { Layout };