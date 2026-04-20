import { Outlet, useNavigate } from "react-router-dom"
import { Header } from "../UI/Header"
import { Footer } from "../UI/Footer"
import { useAuthStore } from "../../store/useAuthStore"
import { useEffect } from "react"

export const AppLayout=()=>{

    const {authUser}=useAuthStore();
    const navigate=useNavigate()

    useEffect(()=>{
        if(!authUser){
            navigate("/signIn")
        }
    },[authUser])

    return (
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}