import { NavLink, useParams } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa6";
import { LuCircleArrowUp } from "react-icons/lu";
import { LuCircleArrowDown } from "react-icons/lu";
import { useExpenseStore } from "../store/useExpenseStore";
import { RiGroupLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { CgArrowsExchange } from "react-icons/cg";
import { useAuthStore } from "../store/useAuthStore";
import { GroupSettleUp } from "../components/UI/GroupSettleUp";
import { useGroupStore } from "../store/useGroupStore";

export const Group=()=>{

    const {authUser}=useAuthStore()
    const {getGroupExpense,expense,getGroupTransaction,groupTransaction,isFetchingExpense,isFetchingTransaction}=useExpenseStore()
    const {group,getGroup,isSearchingGroup}=useGroupStore()
    const {id}=useParams()
    const [balance,setBalance]=useState(0)
    const [showSettle,setShowSettle]=useState(false)

    // setBalance(0);
    const countBalance=()=>{
        let owe=0
        let owed=0;
        groupTransaction.map((t)=>{
            if(t.member1==authUser.userName && t.groupId==id){
                owe=Number(owe)+t.amount;
            }else if(t.groupId==id){
                owed=Number(owed)+t.amount
            }
        })
        console.log(owe-owed);
        setBalance(owe-owed)
    }

    useEffect(()=>{
        const formData={groupId: id}
        getGroup(formData)
        getGroupExpense(formData)
        getGroupTransaction(formData)
    },[])

    useEffect(()=>{
        if(groupTransaction.length>0 && !isFetchingTransaction){
            console.log(groupTransaction)
            countBalance();
        }
    },[groupTransaction,isFetchingTransaction])

    if(isSearchingGroup || !group?.groupName){
        return (
            <main className="w-full min-h-screen bg-[#0d0f1c] pt-16 text-white">
                <p>Loading...</p>
            </main>
        )
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
                                <RiGroupLine className="text-7xl bg-[#ffffff30] p-2 rounded-[50%]"/>
                            </div>
                            <div>
                                <p className="text-lg">{group?.groupName}</p>
                                <p className="text-[#ffffff60]">{group?.members?.length} members</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2 items-center bg-[#ffffff] text-black px-4 py-1 rounded-lg cursor-pointer hover:shadow-lg transition duration-300 ease-in-out shadow-[#ffffff60]" onClick={()=> setShowSettle(true)}>
                                <CgArrowsExchange className="text-2xl"/>
                                <p className="text-lg">Settle up</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-[3fr_2fr] gap-4">
                        <div className="border border-[#ffffff50] p-4 rounded-xl flex flex-col gap-4">
                            <h1 className="text-2xl font-bold">Balance</h1>
                            <p className={`text-center text-3xl font-bold ${balance>=0?'text-green-400':'text-rose-400'}`}>
                                ₹ {balance>0?balance:-balance}
                            </p>
                            <div className="pb-4 border-b border-[#ffffff40] flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <LuCircleArrowDown className="text-rose-400 text-lg"/>
                                    <p>You owe</p>
                                </div>
                                <div className="">
                                    {
                                        groupTransaction.map((t,idx)=>{
                                            return t.member2==authUser.userName && t.amount>0? 
                                            <div key={idx}>
                                                <p>{t.member1}</p>
                                                <p>₹ {t.amount}</p>
                                            </div>:
                                            null
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <LuCircleArrowUp className="text-green-400 text-lg"/>
                                    <p>You are owed</p>
                                </div>
                                <div className="">
                                    {
                                        groupTransaction.map((t,idx)=>{
                                            return t.member1==authUser.userName && t.amount>0? 
                                            <div key={idx} className="flex justify-between">
                                                <p>{t.member2}</p>
                                                <p className="text-green-400">₹ {t.amount}</p>
                                            </div>:
                                            null
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="border border-[#ffffff50] p-4 rounded-xl flex flex-col gap-4">
                            <h1 className="text-2xl font-bold"><u>Members</u></h1>
                            <div className="flex flex-col gap-1">
                                {
                                    group?.members?.map((m,idx)=>{
                                        return (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <FaUserGraduate/>
                                                <p>{m}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
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
                                                    exp.paidBy==authUser.userName?
                                                    <p className="text-green-500 text-sm">You paid</p>:
                                                    <p className="text-rose-500 text-sm">{exp?.paidBy} paid</p>
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
            {/* <GroupSettleUp showSettle={showSettle} setShowSettle={setShowSettle} group={group}/> */}
        </>
    )
}