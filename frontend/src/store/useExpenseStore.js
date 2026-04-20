import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useExpenseStore=create((set,get)=>({
    transaction: [],
    groupTransaction: [],
    expense: [],
    user: null,
    balance: {},
    isAddingExpense: false,
    youOwe: 0,
    youOwed: 0,
    isSearchingUser: false,
    isFetchingExpense: false,
    isFetchingTransaction: false,

    getAllTransaction: async ()=>{
        try {
            const res=await axiosInstance.get("/transaction/getAllTransaction")
            const data=res.data;
            set({transaction: data})
        } catch (error) {
            console.log("Error in useExpenseStore getAllExpense: ",error.response.data.message)
            set({transaction: []});
        }
    },

    addExpense: async (formData)=>{
        set({isAddingExpense: true});
        try {
            const res=await axiosInstance.post("/expense/createExpense",formData);
            await get().getAllTransaction();
            toast.success("Expense added!!")
            set({isAddingExpense: false});
            return true;
        } catch (error) {
            console.log("Error in useExpenseStore addExpense: ",error.message)
            toast.error(error.response.data.message)
            set({isAddingExpense: false});
            return false;
        }
    },

    addSettlement: async (formData)=>{
        set({isAddingExpense: true});
        try {
            const res=await axiosInstance.post("/expense/createSettlement",formData);
            await get().getExpense({userName: formData.userName});
            await get().getBalance({userName: formData.userName});
            toast.success("Settlement successful!!")
            set({isAddingExpense: false});
            return true;
        } catch (error) {
            console.log("Error in useExpenseStore addSettlement: ",error.message)
            toast.error(error.response.data.message)
            set({isAddingExpense: false});
            return false;
        }
    },

    addGroupSettlement: async (formData)=>{
        set({isAddingExpense: true});
        try {
            const res=await axiosInstance.post("/expense/createGroupSettlement",formData);
            await get().getGroupExpense({groupId: formData.groupId});
            await get().getGroupTransaction({groupId: formData.groupId});
            toast.success("Settlement successful!!")
            set({isAddingExpense: false});
            return true;
        } catch (error) {
            console.log("Error in useExpenseStore addGroupSettlement: ",error.message)
            toast.error(error.response.data.message)
            set({isAddingExpense: false});
            return false;
        }
    },

    addGroupExpense: async(formData)=>{
        set({isAddingExpense: true});
        try {
            const res=await axiosInstance.post("/expense/createGroupExpense",formData);
            await get().getAllTransaction();
            toast.success("Expense added!!")
            set({isAddingExpense: false});
            return true;
        } catch (error) {
             console.log("Error in useExpenseStore addExpense: ",error.message)
            toast.error(error.response.data.message)
            set({isAddingExpense: false});
            return false;
        }
    },

    getUser: async (formData)=>{
        set({isSearchingUser: true})
        try {
            const res=await axiosInstance.get(`/auth/getUser/${formData.id}`)
            const data=res.data;
            set({user: data});
        } catch (error) {
            console.log("Error in getUser useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }finally{
            set({isSearchingUser: false});
        }
    },

    getExpense: async (formData)=>{
        set({isFetchingExpense: true})
        try {
            const res=await axiosInstance.get(`/expense/getExpense/${formData.id}`)
            const data=res.data;
            set({expense: data})
        } catch (error) {
            console.log("Error in getExpense useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }finally{
            set({isFetchingExpense: false})
        }
    },

    getGroupExpense: async (formData)=>{
        try {
            const res=await axiosInstance.get(`/expense/getGroupExpense/${formData.groupId}`)
            const data=res.data;
            set({expense: data})
        } catch (error) {
            console.log("Error in getExpense useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }
    },

    getBalance: async (formData)=>{
        try {
            const res=await axiosInstance.get(`/transaction/getTransaction/${formData.id}`)
            const data=res.data
            set({balance: data})
        } catch (error) {
            console.log("Error in getBalance useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }
    },
    
    getGroupTransaction: async (formData)=>{
        set({isFetchingTransaction: true})
        try {
            const res=await axiosInstance.get(`/transaction/getGroupTransaction/${formData.groupId}`)
            const data=res.data
            set({groupTransaction: data})
        } catch (error) {
            console.log("Error in getGroupTransaction useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }finally{
            set({isFetchingTransaction: false})
        }
    }
}))