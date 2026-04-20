const mongoose=require("mongoose")

const expenseSchema=mongoose.Schema({
    isGroupExpense: {
        type: Boolean,
        default: false
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        default: 2
    }
},{timestamps: true})

const Expense=mongoose.model("Expense",expenseSchema)
module.exports=Expense