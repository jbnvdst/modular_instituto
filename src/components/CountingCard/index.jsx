import React from 'react'
import { FaUsers } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { IoBarChart } from "react-icons/io5";

function CountingCard({ title, count, icon }) {
return (
    <div className='flex flex-col w-full bg-white border border-gray-100 shadow-md rounded-2xl items-center p-4'>
            {icon === "FaUsers" ? <FaUsers className='text-4xl text-[#0f787195]' /> : null}
            {icon === "IoBed" ? <IoBed className='text-4xl text-[#0f787195]' /> : null}
            {icon === "FaUserDoctor" ? <FaUserDoctor className='text-4xl text-[#0f787195]' /> : null}
            {icon === "IoBarChart" ? <IoBarChart className='text-4xl text-[#0f787195]' /> : null}
            <h1 className=' mt-2 text-2xl font-bold text-gray-800'>
                {count}{icon === "IoBarChart" ? "+" : ""}
            </h1>
            <p className='text-sm text-gray-500'>{title}</p>
    </div>
)
}


export { CountingCard };