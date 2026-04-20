import { useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { FaUserGraduate } from "react-icons/fa6";
import { RiGroupLine } from "react-icons/ri";
import { RiGroup3Line } from "react-icons/ri";
import { useAuthStore } from "../store/useAuthStore";
import { useExpenseStore } from "../store/useExpenseStore";
import { useGroupStore } from "../store/useGroupStore";
import { NavLink } from "react-router-dom";

export const Contact=()=>{

    const {authUser}=useAuthStore()
    const {groups,getAllGroups}=useGroupStore();
    const {transaction,getAllTransaction}=useExpenseStore();
    const [people,setPeople]=useState([]);
        
    useEffect(()=>{
        getAllTransaction();
        getAllGroups();      
    },[])
    
    useEffect(()=>{
        if(transaction){
            const list=[];
            transaction.map((t)=>{
                console.log("h")
                if(authUser.userName==t.member1){
                    list.push(t.member2);
                }else{
                    list.push(t.member1);
                }
            })
            setPeople(list);
            console.log(list)
        }
    },[transaction])

    return (
        <main className="w-full min-h-screen bg-[#0d0f1c] pt-16 text-white">
            <div className="p-4">
                <h1 className="text-4xl font-bold">Contacts</h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="">
                        <div className="flex items-center gap-2 py-4">
                            <BsPerson className="text-2xl"/>
                            <p className="text-xl font-semibold">People</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                people?people.map((p,idx)=>{
                                    return (
                                        <NavLink to={`/person/${p}`} key={idx} className="flex gap-2 px-4 py-2 border-2 border-[#ffffff30] rounded-lg cursor-pointer hover:bg-[#ffffff10]">
                                            <FaUserGraduate className="text-2xl"/>
                                            <p className="text-xl">{p}</p>
                                        </NavLink>
                                    )
                                }):""
                            }
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 py-4">
                            <RiGroupLine className="text-2xl"/>
                            <p className="text-xl font-semibold">Groups</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                groups?groups.map((g,idx)=>{
                                    return (
                                        <NavLink to={`/group/${g._id}`} key={idx} className="flex gap-2 px-4 py-2 border-2 border-[#ffffff30] rounded-lg cursor-pointer hover:bg-[#ffffff10]">
                                            <RiGroup3Line className="text-2xl"/>
                                            <p className="text-xl">{g.groupName}</p>
                                        </NavLink>
                                    )
                                }):""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}