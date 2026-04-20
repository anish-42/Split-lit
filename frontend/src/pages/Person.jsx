import { NavLink, useParams } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6";
import userImg from "/user.png"
import { useExpenseStore } from "../store/useExpenseStore";
import { useEffect, useState } from "react";
import { CgArrowsExchange } from "react-icons/cg";
import { useAuthStore } from "../store/useAuthStore";
import { SettleUp } from "../components/UI/SettleUp";

export const Person=()=>{

    const {authUser}=useAuthStore()
    const {user,isSearchingUser,getUser,getExpense,expense,getBalance,balance}=useExpenseStore()
    const {id}=useParams()
    const [showSettle,setShowSettle]=useState(false)

    useEffect(()=>{
        const formData={id}
        getUser(formData)
        getExpense(formData)
        getBalance(formData)
    },[id])

    if(!user && isSearchingUser){
        return <h1>Loading...</h1>
    }

    return (
        <>
            <main className="w-full min-h-screen bg-[#0d0f1c] pt-16 text-white">
                <div className="w-[80%]  mx-auto p-4 flex flex-col gap-8">
                    <div className="flex">
                        <NavLink to="/dashboard" className="bg-[#ffffff40] flex items-center gap-2 px-4 py-1 rounded-lg"><FaArrowLeft/>Back</NavLink>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <img src={userImg} alt="user" className="w-[70px] rounded-[50%] border-3"/>
                            </div>
                            <div>
                                <p className="text-lg">{user?.userName}</p>
                                <p className="text-[#ffffff60]">{user?.email}</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2 items-center bg-[#ffffff] text-black px-4 py-1 rounded-lg cursor-pointer hover:shadow-lg transition duration-300 ease-in-out shadow-[#ffffff60]" onClick={()=> setShowSettle(true)}>
                                <CgArrowsExchange className="text-2xl"/>
                                <p className="text-lg">Settle up</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-[#ffffff50] p-4 rounded-xl flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Balance</h1>
                        <div className="flex justify-between items-center">
                            {
                                balance?.member1==authUser?._id?
                                <p>{user?.fullName} owes you</p>:
                                <p>You owes {user?.fullName}</p>
                            }
                            <p className={`text-2xl font-semibold ${balance?.member1==authUser?._id?'text-green-500':'text-rose-500'}`}>₹ {balance?.amount}</p>
                        </div>
                    </div>
                    <div className="border border-[#ffffff50] p-4 rounded-xl">
                        <h1 className="text-2xl font-bold  pb-4">Expenses</h1>
                        <div>
                            {
                                expense.map((exp,idx)=>{
                                    return (
                                        <div key={idx} className="flex justify-between items-center border-b-1 border-[#ffffff40] py-1">
                                            <div>
                                                <p className="text-lg">{exp?.title}</p>
                                                <p className="text-sm text-[#ffffff80]">{exp?.createdAt.split('T')[0]}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-lg font-semibold">₹ {exp?.amount}</p>
                                                {
                                                    exp.paidBy._id==authUser._id?
                                                    <p className="text-green-500 text-sm">You paid</p>:
                                                    <p className="text-rose-500 text-sm">{exp?.paidBy.userName} paid</p>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </main>
            <SettleUp showSettle={showSettle} setShowSettle={setShowSettle} user={user}/>
        </>
    )
}