const Transaction=require('../models/transaction.model')

const getAllTransaction=async (req,res)=>{
    try {
        const userId=req.user._id;
        const transactions=await Transaction.find({
            $or: [
                {member1: userId},
                {member2: userId}
            ]
        }).populate({path: 'groupId'})
        .populate({path: 'member1'})
        .populate({path: 'member2'})
        res.status(201).json(transactions);
    } catch (error) {
        console.log("Error in getAllTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getTransaction=async (req,res)=>{
    try {
        const {secondUser}=req.params
        const userId=req.user._id
        if(!secondUser){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const transaction=await Transaction.findOne({
            $or: [{member1: secondUser, member2: userId, isGroupTransaction: false},
                {member1: userId, member2: secondUser, isGroupTransaction: false}
            ]
        })
        res.status(201).json(transaction)
    } catch (error) {
        console.log("Error in getTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getGroupTransaction=async (req,res)=>{
    try {
        const {groupId}=req.params
        const userId=req.user._id
        if(!groupId){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const transaction=await Transaction.find({
            $or: [{member1: userId, isGroupTransaction: true, groupId},
                {member2: userId, isGroupTransaction: true, groupId}
            ]
        })
        res.status(201).json(transaction)
    } catch (error) {
        console.log("Error in getGroupTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

module.exports={
    getAllTransaction,
    getTransaction,
    getGroupTransaction
}