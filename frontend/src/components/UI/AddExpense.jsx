import { useState } from "react"
import { useAuthStore } from "../../store/useAuthStore"
import { useGroupStore } from "../../store/useGroupStore"
import toast, { Toaster } from "react-hot-toast"
import { useExpenseStore } from "../../store/useExpenseStore"

export const AddExpense=({showAddExpense,setShowAddExpense})=>{

    const {authUser,addParticipant,isAdding}=useAuthStore()
    const {addExpense,addGroupExpense}=useExpenseStore()
    const {groups}=useGroupStore()

    const [groupDetails,setGroupDetails]=useState({});
    const [individualExp,setIndividualExp]=useState(true)
    const [parti,setParti]=useState("");
    const [individualExpense,setIndividualExpense]=useState({
        title: "",
        amount: 0,
        category: "Food",
        participant: "",
        whoPaid: authUser?.userName,
    })

    const [groupName,setGroupName]=useState("--- Select your group ---")

    const handleAddParticipant=async (e)=>{
        e.preventDefault();
        if(parti.trim().length==0){
            toast.error("Username cannot be empty!")
            setIndividualExpense({...individualExpense, [individualExpense.userName]: ""})
            return;
        }
        const add=await addParticipant({userName: parti});
        console.log(add);
        if(add!=""){
            console.log(add)
            setIndividualExpense({...individualExpense, participant: parti})
        }
    }

    const formCheck=()=>{
        if(individualExpense.title.trim().length==0){
            toast.error("Title cannot be empty!!")
            return false;
        }
        if(individualExpense.amount<=0){
            toast.error("Amountmust be greater than 0!!")
            return false;
        }
        if(individualExp){
            if(individualExpense.participant==""){
                toast.error("Add a participant!!")
                return false;
            }
        }else{
            if(groupName=="--- Select your group ---"){
                toast.error("Select a group")
                return false;
            }
        }
        return true;
    }

    const handleFormSubmit=async (e)=>{
        e.preventDefault();
        const check=formCheck();
        if(check){
            let formData={
                amount: individualExpense.amount,
                paidBy: individualExpense.whoPaid,
                title: individualExpense.title,
                category: individualExpense.category
            }
            if(individualExp){
                formData={...formData, paidTo: authUser.userName==individualExpense.whoPaid?individualExpense.participant:authUser.userName,}
            }else{
                formData={...formData, groupId:groupName}
            }
            let add;
            if(individualExp){
                add=await addExpense(formData)
            }else{
                add=await addGroupExpense(formData)
            }
            if(add){
                setIndividualExpense({
                    title: "",
                    amount: 0,
                    category: "Food",
                    participant: "",
                    whoPaid: authUser.userName,
                })
                setGroupName("--- Select your group ---")
                setShowAddExpense(false);
            }
        }
    }

    const handleScreenClose=()=>{
        setIndividualExpense({
            title: "",
            amount: 0,
            category: "Food",
            participant: "",
            whoPaid: authUser.userName,
        });
        setParti("")
        setGroupName("--- Select your group ---")
        setShowAddExpense(false)
    }


    const selectGroup=(id)=>{
        const filtered=groups.filter((g)=>{
            return g._id==id;
        })
        setGroupDetails(filtered[0]);
        console.log(filtered[0])
        return ;
    }

    const handleGroupChange=(e)=>{
        setGroupName(e.target.value)
        selectGroup(e.target.value);
        console.log(e);
    }

    return (
        <>
            <div className={`fixed top-0 w-full h-screen flex justify-center items-center bg-[#00000099] backdrop-blur-xs ${showAddExpense?'':'hidden'}`} onClick={handleScreenClose}> 
                <div className="w-[600px] rounded py-4 px-8 bg-[#0d0f1c] border border-[#ffffff10] text-white" onClick={(e)=> e.stopPropagation()}>
                    <h1 className="text-center text-3xl font-bold pb-4">Add Expense</h1>
                    <div className="grid grid-cols-2 gap-2 mb-4 border-y border-[#ffffff50] py-1">
                        <p className={`text-center rounded-lg cursor-pointer ${individualExp? 'bg-white text-black':''}`} onClick={()=> setIndividualExp(true)}>Individual Expense</p>
                        <p className={`text-center rounded-lg cursor-pointer ${individualExp? '':'bg-white text-black'}`} onClick={()=> setIndividualExp(false)}>Group Expense</p>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" id="title" placeholder="Enter a title..." value={individualExpense.title} onChange={(e)=> setIndividualExpense({...individualExpense, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]"/>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="amount">Amount</label>
                            <input type="number" name="amount" id="amount" value={individualExpense.amount} onChange={(e)=> setIndividualExpense({...individualExpense, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]"/>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="category">Category</label>
                            <select name="category" id="category" value={individualExpense.category} onChange={(e)=> setIndividualExpense({...individualExpense, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]">
                                <option value="Food" className="bg-sky-500 text-white">Food</option>
                                <option value="Rent" className="bg-sky-500 text-white">Rent</option>
                                <option value="Travel" className="bg-sky-500 text-white">Travel</option>
                                <option value="Shopping" className="bg-sky-500 text-white">Shopping</option>
                                <option value="Education" className="bg-sky-500 text-white">Education</option>
                                <option value="Health" className="bg-sky-500 text-white">Health</option>
                                <option value="Bills/Fees" className="bg-sky-500 text-white">Bills/Fees</option>
                                <option value="Other" className="bg-sky-500 text-white">Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            {
                                individualExp?
                                    <>
                                        <label htmlFor="participant">Participant</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="parti" id="participant" placeholder="Enter a participant..." value={parti} onChange={(e)=> setParti(e.target.value)} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]" readOnly={individualExpense.participant}/>
                                            <input type="button" value={`${isAdding?'Adding':'Add'}`} className="bg-green-600 px-2 rounded items-center cursor-pointer hover:bg-green-500" onClick={handleAddParticipant} disabled={individualExpense.participant || isAdding} />
                                        </div>
                                    </>:
                                    <>
                                        <label htmlFor="group">Group</label>
                                        <select name="group" id="group" className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]" value={groupName} onChange={handleGroupChange}>
                                            <option value="--- Select your group ---" className="bg-sky-500 text-white">--- Select your group ---</option>
                                            {
                                                groups.map((group,idx)=>{
                                                    return <option key={idx} value={group._id} className="bg-sky-500 text-white">{group.groupName}</option>
                                                })
                                            }
                                        </select>
                                    </>
                            }
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="whoPaid">Who paid?</label>
                            <select name="whoPaid" id="whoPaid" value={individualExpense.whoPaid} onChange={(e)=> setIndividualExpense({...individualExpense, [e.target.name]: e.target.value})} className="border w-full rounded border-[#ffffff35] outline-none px-2 py-0.5 text-sm text-[#ffffff70]">
                                <option value={authUser?.userName} className="bg-sky-500 text-white">You</option>
                                {
                                    individualExp?
                                        individualExpense.participant?<option value={parti} className="bg-sky-500 text-white">{parti}</option>:""
                                        :
                                        groupName!="--- Select your group ---"?
                                            groupDetails.members.map((ele,idx)=>{
                                                if(ele!=authUser.userName)
                                                    return <option key={idx} value={ele} className="bg-sky-500 text-white">{ele}</option>
                                            })
                                        :"hjgjh"
                                }
                            </select>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                            <label htmlFor="total">Total</label>
                            <p className=" w-full rounded bg-[#ffffff35] outline-none px-2 py-0.5 text-sm">{individualExpense.amount}</p>
                        </div>
                        <input type="submit" value="Create Expense" className="bg-sky-500 py-1 text-xl rounded-xl"/>
                    </form>

                </div>
            </div>
            <Toaster/>
        </>
    )
}