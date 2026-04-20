import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { create } from "zustand"

export const useAuthStore=create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isChecking: true,
    isAdding: false,

    signUp: async (formData)=>{
        set({isSigningUp: true})
        try {
            const res=await axiosInstance.post("/auth/signUp",formData)
            set({authUser: res.data});
            set({isSigningUp: false})
            return true;
        } catch (error) {
            set({authUser: null});
            toast.error(error.response.data.message)
            console.log("Error in useAuthStore signUp: ",error)
            set({isSigningUp: false})
            return false;
        }
    },

    signIn: async (formData)=>{
        set({isSigningIn: true})
        try {
            const res=await axiosInstance.post("/auth/signIn", formData)
            set({authUser: res.data})
            set({isSigningIn: false});
            return true;
        } catch (error) {
            set({authUser: null});
            console.log("Error in useAuthStore signIn: ",error)
            toast.error(error.response.data.message)
            set({isSigningIn: false});
            return false;
        }
    },

    checkAuth: async ()=>{
        try {
            const res=await axiosInstance.get("/auth/check")
            set({authUser: res.data})
        } catch (error) {
            set({authUser: null})
            console.log("Error in useAuthStore check: ",error)
        }finally{
            set({isChecking: false})
        }
    },

    logout: async ()=>{
        try {
            const res=await axiosInstance.post("/auth/logout")
            set({authUser: null})
        } catch (error) {
            console.log("Error in useAuthStore logout: ",error)
        }
    },

    addParticipant: async (formData)=>{
        set({isAdding: true});
        try {
            const res=await axiosInstance.post("/auth/addParticipant/",formData)
            const data=res.data;
            set({isAdding: false});
            toast.success("Added!!")
            return data;
        } catch (error) {
            console.log("Error in useAuthstore addParticipant: ",error)
            toast.error(error.response.data.message)
            set({isAdding: false});
            return "";
        }
    }
}))