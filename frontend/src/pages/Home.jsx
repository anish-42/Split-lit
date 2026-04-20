import { NavLink, useNavigate } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export const Home=()=>{

    const {authUser}=useAuthStore()
    const navigate=useNavigate()
        
    useEffect(()=>{
        if(!authUser){
            navigate("/signIn")
        }
    },[authUser])

    return (
        <main className="w-full min-h-screen bg-[#0d0f1c] text-white pt-16">
            <div className="w-[80%] mx-auto flex flex-col items-center p-8">
                <div>
                    <p className="text-sm bg-white px-12 py-0.5 rounded-xl text-green-700 font-semibold">Split smart. Live lit.</p>
                    <p className="text-center text-xs py-1 text-[#ffffff80]">Version 2.0.0</p>
                </div>
                <div className="py-8">
                    <p className="text-8xl leading-[110px] text-center text-green-70">Say goodbye to mental maths & messy payloads.</p>
                    <p className="text-center py-4 text-xl px-4 text-[#aaaaaa]">Track group expenses, settle instantly, and keep it fair whether it's rent, food or that late-night pizza's.</p>
                    <div className="flex justify-center py-8 gap-8">
                        <NavLink to="/dashboard" className="flex justify-center items-center gap-2 borde px-8 py-0.5 rounded-lg text-xl bg-green-500 hover:bg-green-600">Get Started <FaArrowRightLong/></NavLink>
                        <NavLink className="gap-2 border px-8 py-0.5 rounded-lg text-xl border-[#ffffff30] hover:bg-white hover:text-[#0d0f1c]">Contact Us</NavLink>
                    </div>
                </div>
                <div className="bg-[#ffffff] p-1 rounded w-[80%] my-4">
                    <img src="./image.png" alt="SplitLit" className="rounded w-full"/>
                </div>
            </div>
        </main>
    )
}