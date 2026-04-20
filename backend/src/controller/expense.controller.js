const Expense = require("../models/expense.model");
const Transaction=require("../models/transaction.model")
const Group=require("../models/group.model");
const User = require("../models/auth.model");

const createExpense = async (req, res) => {
  try {
    let { title, amount, paidBy, paidTo, category } = req.body;
    if (!title || !amount || !paidBy || !paidTo || !category) {
      return res.status(401).json({ message: "Fields are missing!!" });
    }

    // 🔹 Find users in DB by username (or email, depending on your schema)
    const paidByUser = await User.findOne({ username: paidBy });
    const paidToUser = await User.findOne({ username: paidTo });

    if (!paidByUser || !paidToUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const share = (amount / 2).toFixed(2);

    const newExpense = new Expense({
      title,
      amount,
      paidBy: paidByUser._id,   // use ObjectId
      paidTo: paidToUser._id,   // use ObjectId
      category
    });

    await newExpense.save();

    let transaction = await Transaction.findOne({
      isGroupTransaction: false,
      member1: paidByUser._id,
      member2: paidToUser._id
    });

    if (!transaction) {
      transaction = await Transaction.findOne({
        isGroupTransaction: false,
        member1: paidToUser._id,
        member2: paidByUser._id
      });
    }

    if (!transaction) {
      const newTransaction = new Transaction({
        member1: paidByUser._id,
        member2: paidToUser._id,
        amount: share
      });
      await newTransaction.save();
    } else {
      if (transaction.member1.toString() === paidByUser._id.toString()) {
        const sum = Number(transaction.amount) + Number(share);
        await Transaction.findByIdAndUpdate(transaction._id, { amount: sum });
      } else {
        if (Number(transaction.amount) >= Number(share)) {
          const sum = Number(transaction.amount) - Number(share);
          await Transaction.findByIdAndUpdate(transaction._id, { amount: sum });
        } else {
          const sum = Number(share) - Number(transaction.amount);
          await Transaction.findByIdAndUpdate(transaction._id, {
            amount: sum,
            member1: transaction.member2,
            member2: transaction.member1
          });
        }
      }
    }

    res.status(201).json(newExpense);
  } catch (error) {
    console.log("Error in create expense controller: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};


const createSettlement=async (req,res)=>{
    try {
        let {title,amount,paidBy,paidTo,category}=req.body;
        if(!title || !amount || !paidBy || !paidTo || !category){
            res.status(401).json({message: "Fields are missing!!"});
            return ;
        }
        const share=amount;
        const newExpense=new Expense({
            title,
            amount: amount,
            paidBy,
            paidTo,
            category
        })
        await newExpense.save();
        let transaction=await Transaction.findOne({isGroupTransaction: false, member1: paidBy, member2: paidTo});
        if(!transaction){
            transaction=await Transaction.findOne({isGroupTransaction: false, member1: paidTo, member2: paidBy})
        }
        if(!transaction){
            const newTransaction=new Transaction({
                member1: paidBy,
                member2: paidTo,
                amount: share
            })
            await newTransaction.save();
        }else{
            if(transaction.member1==paidBy){
                const sum=Number(transaction.amount)+Number(share);
                await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
            }else{
                if(Number(transaction.amount)>=Number(share)){
                    const sum=Number(transaction.amount)-Number(share);
                    await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
                }else{
                    const sum=Number(share)-Number(transaction.amount);
                    await Transaction.findByIdAndUpdate(transaction._id, {amount: sum, member1: transaction.member2, member2: transaction.member1});
                }
            }
        }
        res.status(201).json(newExpense);
    } catch (error) {
        console.log("Error in create settlement controller: ",error);
        res.status(401).json({message: "Internal server error!"});
    }
}

const createGroupSettlement=async (req,res)=>{
    try {
        let {title,amount,paidBy,paidTo,category,groupId}=req.body;
        if(!title || !amount || !paidBy || !paidTo || !category || !groupId){
            res.status(401).json({message: "Fields are missing!!"});
            return ;
        }
        const share=amount;
        const newExpense=new Expense({
            title,
            amount: amount,
            paidBy,
            paidTo,
            category,
            isGroupExpense: true,
            groupId
        })
        await newExpense.save();
        let transaction=await Transaction.findOne({isGroupTransaction: true, groupId: groupId, member1: paidBy, member2: paidTo});
        if(!transaction){
            transaction=await Transaction.findOne({isGroupTransaction: true, groupId, member1: paidTo, member2: paidBy})
        }
        if(!transaction){
            const newTransaction=new Transaction({
                member1: paidBy,
                member2: paidTo,
                amount: share,
                isGroupTransaction: true, 
                groupId
            })
            await newTransaction.save();
        }else{
            if(transaction.member1==paidBy){
                const sum=Number(transaction.amount)+Number(share);
                await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
            }else{
                if(Number(transaction.amount)>=Number(share)){
                    const sum=Number(transaction.amount)-Number(share);
                    await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
                }else{
                    const sum=Number(share)-Number(transaction.amount);
                    await Transaction.findByIdAndUpdate(transaction._id, {amount: sum, member1: transaction.member2, member2: transaction.member1});
                }
            }
        }
        res.status(201).json(newExpense);
    } catch (error) {
        console.log("Error in create group settlement controller: ",error);
        res.status(401).json({message: "Internal server error!"});
    }
}

const createGroupExpense=async (req,res)=>{
    try {
        let {groupId,title,amount,paidBy,category}=req.body;
        if(!title || !amount || !paidBy || !category || !groupId){
            res.status(401).json({message: "Fields are missing!!"});
            return ;
        }
        const group=await Group.findById(groupId);
        if(!group){
            res.status(401).json({message: "Group doesn't exists!"});
            return ;
        }
        const members=group.members;
        const share=(Number(amount)/members.length).toFixed(2);
        const ops=members.filter((ele)=>{
            return ele!=paidBy;
        })
        const newExpense=new Expense({
            title,
            amount: amount,
            paidBy,
            category,
            isGroupExpense: true,
            groupId,
            number: members.length
        })
        await newExpense.save();

        const tasks=ops.map(async (ele)=>{
            const paidTo=ele;
            let transaction=await Transaction.findOne({isGroupTransaction: true, groupId: groupId, member1: paidBy, member2: paidTo});
            if(!transaction){
                transaction=await Transaction.findOne({isGroupTransaction: true, groupId: groupId, member1: paidTo, member2: paidBy})
            }
            if(!transaction){
                const newTransaction=new Transaction({
                    member1: paidBy,
                    member2: paidTo,
                    amount: share,
                    isGroupTransaction: true,
                    groupId: groupId,
                })
                await newTransaction.save();
            }else{
                if(transaction.member1==paidBy){
                    const sum=Number(transaction.amount)+Number(share);
                    await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
                }else{
                    if(transaction.amount>=share){
                        const sum=Number(transaction.amount)-Number(share);
                        await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
                    }else{
                        const sum=Number(share)-Number(transaction.amount);
                        await Transaction.findByIdAndUpdate(transaction._id, {amount: sum, member1: transaction.member2, member2: transaction.member1});
                    }
                }
            }
            
        })
        await Promise.all(tasks)
        res.status(201).json(newExpense);
    } catch (error) {
        console.log("Error in createGroupExpense controller: ",error.message)
        res.status(401).json({message: "Internal server error!"});
    }
}

const getExpense=async (req,res)=>{
    try {
        const {secondUser}=req.params;
        const userId=req.user._id
        if(!secondUser){
            res.status(401).json({message: "Fields are missing!"})
            return ;
        }
        
        const expense=await Expense.find({
            $or: [{paidBy: userId, paidTo: secondUser, isGroupExpense: false},
                {paidBy: secondUser, paidTo: userId, isGroupExpense: false}
            ]
        }).populate({path: 'paidBy'})
        .populate({path: 'paidTo'})
        res.status(201).json(expense);
        return ;
        
    } catch (error) {
        console.log("Error in get expense controller: ",error.message);
        res.status(401).json({message: "Internal server error!"})
    }
}

const getGroupExpense=async (req,res)=>{
    try {
        const {groupId}=req.params;
        const userId=req.user._id
        if(!groupId){
            res.status(401).json({message: "Fields are missing!"})
            return ;
        }
        const group=await Group.findById(groupId)
        if(!group){
            res.status(401).json({message: "Invalid groupId!"});
            return ;
        }
        const expense=await Expense.find({isGroupExpense: true, groupId})
        res.status(201).json(expense);
        return ;
        
    } catch (error) {
        console.log("Error in get Group expense controller: ",error.message);
        res.status(401).json({message: "Internal server error!"})
    }
}

const updateExpense=async (req,res)=>{
    try {
        const {amount,paidBy,paidTo}=req.body;
        if(!amount || !paidBy || !paidTo){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const transaction=new Transaction.findOne({member1:paidTo, member: paidBy});
        if(!transaction){
            res.status(401).json({message: "Invalid transaction settlement!"});
            return ;
        }
        if(transaction.amount < amount){
            res.status(401).json({message: "Settlement amount cannot be greater than expense - create a new expense!"});
            return ;
        }
        const sum=transaction.amount-amount;
        const updatedTransaction=await Transaction.findByIdAndUpdate(transaction._id, {amount: sum},{new: true});
        res.status(201).json(updatedTransaction);
    } catch (error) {
        console.log("Error in update expense controller: ",error.message)
        res.status(401).json({message: "Internal server error!"})
    }
}

const deleteExpense=async (req,res)=>{
    try {
        const {expenseId}=req.body;
        const userId=req.user._id;
        if(!expenseId){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const expense=await Expense.findById(expenseId);
        if(!expense){
            res.status(401).json({message: "No such expense exists!"})
            return ;
        }
        if(expense.paidBy!=userId && expense.paidTo!=userId){
            res.status(401).json({message: "User unauthorized!"});
            return ;
        }
        const amount=expense.amount;
        const transaction=await Transaction.find({
            $0r: 
            [{member1: userName},
            {member2: userName}]
        })
        if(!transaction){
            res.status(401).json({message: "Internal server error!"});
            return ;
        }
        if(expense.paidBy==transaction.member1){
            if(transaction.amount>=amount){
                const sum=transaction.amount-amount;
                await Transaction.findByIdAndUpdate(transaction._id, {amount: sum})
            }else{
                const sum=amount-transaction.amount;
                await Transaction.findByIdAndUpdate(transaction._id, {amount: sum, member1: transaction.member2, member2: transaction.member1});
            }
        }else{
            const sum=transaction.amount+amount;
            await Transaction.findByIdAndUpdate(transaction._id, {amount: sum});
        }
        const deletedExpense=await Expense.findByIdAndDelete(expense._id);
        return res.status(201).json(deletedExpense);
    } catch (error) {
        console.log("Error in delete expense controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getAllExpense=async (req,res)=>{
    try {
        const {member1,isGroupExpense,groupId}=req.body;
        const member2=req.user._id;
        if(!member1){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        if(isGroupExpense){
            const expenses=await Expense.find({
                $or: [
                    {paidBy: member1, paidTo: member2, isGroupExpense: true, groupId: groupId},
                    {paidBy: member2, paidTo: member1, isGroupExpense: true, groupId: groupId},
                ]
            })
            res.status(201).json(expenses);
        }else{
            const expenses=await Expense.find({
                $or: [
                    {paidBy: member1, paidTo: member2, isGroupExpense: false},
                    {paidBy: member2, paidTo: member1, isGroupExpense: false},
                ]
            })
            return res.status(201).json(expenses)
        }
    } catch (error) {
        console.log("Error in getAllExpense controller: ",error.message)
        res.status(401).json({message: "Internal server error!"});
    }
}

module.exports={
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
    getAllExpense,
    createGroupExpense,
    getGroupExpense,
    createSettlement,
    createGroupSettlement
}