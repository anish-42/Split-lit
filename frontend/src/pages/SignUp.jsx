import { NavLink, useNavigate } from "react-router-dom"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast, { Toaster } from "react-hot-toast"

export const SignUp=()=>{

    const {signUp,authUser}=useAuthStore();
    const [showPassword,setshowPassword]=useState(false)
    const [navigating,setNavigating]=useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        if(authUser){
            navigate("/");
        }
    },[authUser])

    const changeShowPassword=()=>{
        setshowPassword(!showPassword)
    }

    const [user,setUser]=useState({
        fullName: "",
        userName: "",
        email: "",
        password: ""
    })

    const checkFormData=()=>{
        if(user.fullName.trim().length==0){
            toast.error("Invalid fullName!")
            return false;
        }
        if(user.userName.trim().length==0){
            toast.error("Invalid userName!")
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(user.email)){
            toast.error("Invalid email!!")
            return false;
        }
        if(user.password.length<6){
            toast.error("Password must be atleast 6 letters!")
            return false;
        }
        return true;
    }

    const handleOnSubmit=async (e)=>{
        e.preventDefault();
        const check=checkFormData();
        if(!check){
            return ;
        }
        const sign=await signUp(user);
        if(sign){
            setNavigating(true)
            setTimeout(()=>{
                setNavigating(false);
                navigate("/");
            },1000)
        }else{
            setUser({
                fullName: "",
                userName: "",
                email: "",
                password: ""
            })
        }
    }

    return (
        <>
            <div className="bg-[#0D0F1C] w-screen h-screen flex justify-center items-center">
                <div className="text-[#FFFFFF] w-[500px] border-1 rounded border-[#ffffff30] p-4 bg-[#FFFFFF09] flex flex-col items-center">
                    <h1 className="text-4xl">SignUp</h1>
                    <p className="">Create a new Account!</p>
                    <form className="flex flex-col gap-4 w-full py-6" onSubmit={handleOnSubmit}>
                        <div className="flex flex-col text-[#aaaaaa] gap-1 px-4">
                            <label htmlFor="fullName" className="">Full Name</label>
                            <input type="text" name="fullName" id="fullName" placeholder="Aaditya Nigam" value={user.fullName} onChange={(e)=> setUser({...user, [e.target.name]: e.target.value})} className="border-1 border-[#ffffff30] rounded outline-none px-2 py-0.5 text-sm bg-[#0D0F1C]"/>
                        </div>
                        <div className="flex flex-col text-[#aaaaaa] gap-1 px-4">
                            <label htmlFor="userName" className="">User Name</label>
                            <input type="text" name="userName" id="userName" placeholder="Aaditya_Nigam" value={user.userName} onChange={(e)=> setUser({...user, [e.target.name]: e.target.value})} className="border-1 border-[#ffffff30] rounded outline-none px-2 py-0.5 text-sm bg-[#0D0F1C]"/>
                        </div>
                        <div className="flex flex-col text-[#aaaaaa] gap-1 px-4">
                            <label htmlFor="email" className="">Email</label>
                            <input type="email" name="email" id="email" placeholder="aaditya@email.com" value={user.email} onChange={(e)=> setUser({...user, [e.target.name]: e.target.value})} className="border-1 border-[#ffffff30] rounded outline-none px-2 py-0.5 text-sm bg-[#0D0F1C]"/>
                        </div>
                        <div className="flex flex-col text-[#aaaaaa] gap-1 px-4">
                            <label htmlFor="password" className="">Password</label>
                            <div className="border-1 border-[#ffffff30] rounded  px-2 py-0.5 flex gap-4 items-center bg-[#0D0F1C]">
                                <input type={`${showPassword? 'text':'password'}`} name="password" id="password" placeholder="********" value={user.password} onChange={(e)=> setUser({...user, [e.target.name]: e.target.value})} className="outline-none w-full text-sm"/>
                                {
                                    showPassword? <FaEye onClick={changeShowPassword} className="cursor-pointer"/>:<FaEyeSlash onClick={changeShowPassword} className="cursor-pointer"/>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col text-[#aaaaaa] gap-1 px-4 mt-2">
                            <input type="submit" value={`${navigating?'Redirecting...':'SignUp'}`} className="bg-green-500 rounded text-white py-1 cursor-pointer hover:bg-green-600" disabled={navigating}/>
                            <p className="text-white text-center text-sm">Already have an account? <NavLink to="/signIn" className="text-sky-300 hover:text-sky-500 hover:underline">SignIn</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster/>
        </>
    )
}