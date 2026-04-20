import { useState } from "react"
import { useAuthStore } from "../../store/useAuthStore"
import toast, { Toaster } from "react-hot-toast"
import { useExpenseStore } from "../../store/useExpenseStore"

export const GroupSettleUp=({showSettle,setShowSettle,user})=>{

    const {authUser}=useAuthStore()
    const {addGroupSettlement,isAddingExpense}=useExpenseStore()

    const [settlement,setSettlement]=useState({
        title: "",
        amount: 0,
        paidBy: authUser?.userName,
        paidTo: authUser?.userName
    })

    const formCheck=()=>{
        if(settlement.title.trim().length==0){
            toast.error("Title cannot be empty!!")
            return false;
        }
        if(settlement.amount<=0){
            toast.error("Amount must be greater than 0!!")
            return false;
        }
        if(settlement.paidBy==settlement.paidTo){
            toast.error("PaidBy and PaidTo must be different!!")
            return false;
        }
        return true;
    }

    const handleFormSubmit=async (e)=>{
        e.preventDefault();
        const check=formCheck();
        if(check){
            let formData={
                amount: settlement.amount,
                paidBy: settlement.paidBy,
                title: settlement.title,
                category: 'Settlement',
                paidTo: settlement.paidTo,
                groupId: user._id
            }
            const add=await addGroupSettlement(formData)
            if(add){
                setSettlement({
                    title: "",
                    amount: 0,
                    paidBy: authUser?.userName,
                    paidTo: authUser?.userName
                })
                setShowSettle(false);
            }
        }
    }

    const handleScreenClose=()=>{
        setSettlement({
            title: "",
            amount: 0,
            paidBy: authUser?.userName,
            paidTo: authUser?.userName
        });
        setShowSettle(false)
    }



    return (
        <>
            <div className={`fixed top-0 w-full h-screen flex justify-center items-center bg-[#00000099] backdrop-blur-xs ${showSettle?'':'hidden'}`} onClick={handleScreenClose}> 
                <div className="w-[600px] rounded py-4 px-8 bg-[#0d0f1c] border border-[#ffffff10] text-white" onClick={(e)=> e.stopPropagation()}>
                    <h1 className="text-center text-3xl font-bold pb-4">Settle Expense</h1>
                    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" id="title" placeholder="Enter a title..." value={settlement.title} onChange={(e)=> setSettlement({...settlement, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]"/>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="amount">Amount</label>
                            <input type="number" name="amount" id="amount" value={settlement.amount} onChange={(e)=> setSettlement({...settlement, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]"/>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="paidBy">PaidBy?</label>
                            <select name="paidBy" id="paidBy" value={settlement.paidBy} onChange={(e)=> setSettlement({...settlement, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]">
                                <option value={authUser?.userName} className="bg-sky-500 text-white">You</option>
                                {
                                    user.members.map((m,idx)=>{
                                        return m!=authUser.userName?<option key={idx} value={m} className="bg-sky-500 text-white">{m}</option>:null
                                    })
                                }
                            </select>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="paidTo">PaidTo?</label>
                            <select name="paidTo" id="paidTo" value={settlement.paidTo} onChange={(e)=> setSettlement({...settlement, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]">
                                <option value={authUser?.userName} className="bg-sky-500 text-white">You</option>
                                {
                                    user.members.map((m,idx)=>{
                                        return m!=authUser.userName?<option key={idx} value={m} className="bg-sky-500 text-white">{m}</option>:null
                                    })
                                }
                            </select>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="total">Total</label>
                            <p className=" w-full rounded bg-[#ffffff35] outline-none px-2 py-0.5 text-sm">{settlement.amount}</p>
                        </div>
                        <input type="submit" value="Settle" className="bg-sky-500 py-1 text-xl rounded-xl" disabled={isAddingExpense}/>
                    </form>

                </div>
            </div>
            <Toaster/>
        </>
    )
}