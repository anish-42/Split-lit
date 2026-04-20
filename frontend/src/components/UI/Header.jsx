import { NavLink, useNavigate } from "react-router-dom"
import { MdHome } from "react-icons/md";
import { IoMdContacts } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import logo from "/splitLit.svg"

export const Header=()=>{
    
    const {authUser,logout}=useAuthStore()

    const [showUser,setShowUser]=useState(false)

    const navigate=useNavigate()
        
    useEffect(()=>{
        if(authUser==null){
            navigate("/signIn")
        }
    },[authUser])

    return (
        <header className="w-full fixed bg-[#ffffff10] text-white backdrop-blur-sm py-2 px-12 flex justify-between items-center">
            <NavLink to="/">
                <img src={logo} alt="SplitLit" className="w-[150px]"/>
            </NavLink>
            <div>
                <ul className="flex gap-12 items-center">
                    <li className="flex gap-2 items-center border px-2 py-0.5 border-[#ffffff30] rounded cursor-pointer hover:bg-[#0d0f1c] hover:shadow shadow-[#ffffff50]">
                        <MdHome className="text-xl"/>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li className="flex gap-2 items-center border px-2 py-0.5 border-[#ffffff30] rounded cursor-pointer hover:bg-[#0d0f1c] hover:shadow shadow-[#ffffff50]">
                        <LuLayoutDashboard className="text-xl"/>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                    </li>
                    <li className="relative">
                        <FaRegUserCircle className="text-2xl cursor-pointer" onClick={()=> setShowUser(!showUser)}/>
                        <div className={`border absolute right-0 top-7 overflow-hidden rounded-lg bg-white border-2 border-black ${showUser?"":"hidden"}`}>
                            <p className="text-black px-4 py-0.5">{authUser?.userName}</p>
                            <p className="text-rose-500 hover:bg-rose-600 hover:text-white px-4 py-0.5 cursor-pointer" onClick={async ()=> await logout()}>Logout</p>
                        </div>
                    </li>
                </ul>
            </div>
        </header>
    )
}