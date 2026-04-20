import { NavLink, useNavigate } from "react-router-dom"
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuCircleArrowUp } from "react-icons/lu";
import { LuCircleArrowDown } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { AddExpense } from "../components/UI/AddExpense";
import { useEffect, useState } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import { useAuthStore } from "../store/useAuthStore";
import { CreateGroup } from "./CreateGroup";
import { useGroupStore } from "../store/useGroupStore";
import { MdDeleteOutline } from "react-icons/md";

export const Dashboard=()=>{

    const [showAddExpense,setShowAddExpense]=useState(false);
    const [showCreateGroup,setShowCreateGroup]=useState(false)
    const [owe,setOwe]=useState(0);
    const [owed,setOwed]=useState(0);

    const {authUser}=useAuthStore()
    const {transaction,getAllTransaction}=useExpenseStore();
    const {deleteGroup}=useGroupStore()
    
    useEffect(()=>{
        getAllTransaction();  
    },[])

    const navigate=useNavigate()
    
    useEffect(()=>{
        if(!authUser){
            navigate("/signIn")
        }
    },[authUser])
    
    // useEffect(()=>{
    //     getAllTransaction();
    //     getAllGroups();
    //     getExpense({userName: authUser._id}) 
    // },[])
    
    const separateTransactio=()=>{
        let owe=0
        let owed=0;
        transaction?.map((t)=>{
            if(t.member1==authUser?.userName){
                owed=Number(owed)+t.amount;
            }else{
                owe=Number(owe)+t.amount
            }
        })
        setOwe(owe)
        setOwed(owed)
    }

    useEffect(()=>{
        if(transaction.length>0){
            separateTransactio();
        }
    },[transaction])

    // console.log(expense)

    return (
        <>
            <main className="w-full min-h-screen bg-[#0d0f1c] pt-16 text-white">
                <div className="w-[95%] mx-auto px-4 py-8 flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <p className="text-4xl">Dashboard</p>
                        <div className="bg-white text-black px-3 py-1 rounded-lg hover:bg-[#0d0f1c] hover:text-white cursor-pointer border-2 transition duration-500 ease-in-out">
                            <button className="flex gap-4 items-center cursor-pointer" onClick={()=> setShowAddExpense(true)}><IoIosAddCircleOutline className="text-xl"/>Add Expense</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="border-2 border-[#ffffff11] bg-[#ffffff10] flex flex-col gap-8 px-8 py-4 rounded-lg">
                                <p className="text-lg text-[#effff0]">Total Balance</p>
                                <div className="flex flex-col gap-2">
                                    {
                                        owe>owed?<p className="text-3xl text-green-400 font-semibold">₹ {owe - owed}</p>:<p className="text-3xl text-rose-400 font-semibold">₹ {owed - owe}</p>
                                    }
                                </div>
                            </div>
                            <div className="border-2 border-[#ffffff11] bg-[#ffffff10] flex flex-col gap-8 px-8 py-4 rounded-lg">
                                <p className="text-lg text-[#effff0]">You are owed</p>
                                <p className="text-3xl text-green-400 font-semibold">₹ {owe}</p>
                            </div>
                            <div className="border-2 border-[#ffffff11] bg-[#ffffff10] flex flex-col gap-8 px-8 py-4 rounded-lg">
                                <p className="text-lg text-[#effff0]">You owe</p>
                                <p className="text-3xl text-rose-400 font-semibold">₹ {owed}</p>
                            </div>
                        </div>
                        <div className=" grid grid-cols-[2fr_1fr] gap-8">
                            <div className="border py-4 px-8 flex flex-col gap-4 rounded-lg border-[#ffffff11] bg-[#ffffff10]">
                                <h1 className="text-lg text-[#effff0]">Expense Summary</h1>
                                <div className="grid grid-cols-2 gap-8 ">
                                    <div className="border border-[#ffffff20] bg-[#0d0f1c] p-4 rounded-lg flex flex-col gap-2">
                                        <p className="text text-[#effff0]">Total this month</p>
                                        <p className="text-sm text-[#ffffff80]">Future updates...</p>
                                    </div>
                                    <div className="border border-[#ffffff20] bg-[#0d0f1c] p-4 rounded-lg flex flex-col gap-2">
                                        <p className="text text-[#effff0]">Total this year</p>
                                        <p className="text-sm text-[#ffffff80]">Future updates...</p>
                                    </div>
                                </div>
                                <div className="border border-[#ffffff20] bg-[#0d0f1c] p-4 rounded-lg h-[200px]">
                                    <p className="text-sm text-[#ffffff80]">Future updates...</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="border rounded-lg border-[#ffffff11] bg-[#ffffff10] py-4 px-8">
                                    <div className="flex justify-between items-center pb-8">
                                        <p className="">Balance Details</p>
                                        <NavLink to="/contact" className="flex gap-2 items-center text-sm hover:text-[#E0E0E0]"><p className="hover:underline">View all</p> <MdKeyboardArrowRight className="text-lg"/></NavLink>
                                    </div>
                                    <div>
                                        <div className="py-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <LuCircleArrowUp className="text-green-400 text-lg"/>
                                                <p>Owed to you</p>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {
                                                    transaction?.map((ele,idx)=>{
                                                        {
                                                            return ele.member1._id==authUser?._id && ele.amount>0? 
                                                            <NavLink key={idx} to={ele.isGroupTransaction==true?`/group/${ele.groupId._id}`:`/person/${ele.member2._id}`}  className="flex justify-between items-center hover:bg-[#ffffff30] px-2 py-1 rounded">
                                                                <div>
                                                                    <p>{ele.member2.userName}</p>
                                                                    {
                                                                        ele.isGroupTransaction?<p className="text-xs text-[#ffffff90]">{ele.groupId.groupName}</p>:""
                                                                    }
                                                                </div>
                                                                <p className="text-green-400 font-bold">₹ {ele.amount}</p>
                                                            </NavLink>: "";
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <LuCircleArrowDown className="text-rose-400 text-lg"/>
                                                <p>You owe</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {
                                                    transaction?.map((ele,idx)=>{
                                                        {
                                                            return ele.member2._id==authUser?._id && ele.amount>0? 
                                                            <NavLink key={idx} to={ele.isGroupTransaction==true?`/group/${ele.groupId._id}`:`/person/${ele.member1._id}`} className="flex justify-between items-center hover:bg-[#ffffff30] px-2 py-1 rounded">
                                                                <div>
                                                                    <p>{ele.member1.userName}</p>
                                                                    {
                                                                        ele.isGroupTransaction?<p className="text-xs text-[#ffffff90]">{ele.groupId.groupName}</p>:""
                                                                    }
                                                                </div>
                                                                <p className="text-rose-400 font-bold">₹ {ele.amount}</p>
                                                            </NavLink>: "";
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border rounded-lg border-[#ffffff11] bg-[#ffffff10] py-4 px-8 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <p className="">Your Groups</p>
                                        <NavLink to="/contact" className="flex gap-2 items-center text-sm hover:text-[#E0E0E0]"><p className="hover:underline">View all</p> <MdKeyboardArrowRight className="text-lg"/></NavLink>
                                    </div>
                                    <div className="flex flex-col gap-2 max-h-[250px] overflow-auto scrollbar-custom">
                                        {
                                            authUser.groups?.map((group,idx)=>{
                                                return (
                                                    <div key={idx} className="flex items-center justify-between px-2">
                                                        <div className="flex gap-3 items-center">
                                                            <RiGroupLine className="text-4xl bg-[#ffffff40] text-white p-1 rounded-lg"/>
                                                            <NavLink to={`/group/${group._id}`} className="">
                                                                <p>{group.groupName}</p>
                                                                <p className="text-[#ffffff70] text-xs">{group.members?.length} Members</p>
                                                            </NavLink>
                                                        </div>
                                                        <MdDeleteOutline className="text-xl cursor-pointer" onClick={()=> deleteGroup(group._id)}/>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                    </div>
                                    <NavLink to={"createGroup/"} className="flex gap-4 items-center justify-center text-lg rounded-lg py-1 bg-sky-500 hover:bg-sky-600 cursor-pointer"><RiGroupLine />Create Group</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <AddExpense showAddExpense={showAddExpense} setShowAddExpense={setShowAddExpense}/>
        </>
    )
}