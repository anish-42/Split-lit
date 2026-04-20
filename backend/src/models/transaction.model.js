const mongoose=require("mongoose")

const transactionSchema=new mongoose.Schema({
    member1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    member2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isGroupTransaction: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    }
})

const Transaction=new mongoose.model('Transaction', transactionSchema)
module.exports=Transaction