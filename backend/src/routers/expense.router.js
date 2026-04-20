const express=require("express");
const protectedRoute = require("../middleware/auth.middleware");
const { createExpense, getExpense, updateExpense, deleteExpense, getAllExpense, createGroupExpense, getGroupExpense, createSettlement, createGroupSettlement } = require("../controller/expense.controller");
const router=express.Router();

router.post('/createExpense', protectedRoute, createExpense)

router.post('/createSettlement', protectedRoute, createSettlement)

router.post('/createGroupSettlement', protectedRoute, createGroupSettlement)

router.post('/createGroupExpense', protectedRoute, createGroupExpense)

router.get('/getExpense/:secondUser', protectedRoute, getExpense)

router.get('/getGroupExpense/:groupId', protectedRoute, getGroupExpense)

router.post('/updateExpense', protectedRoute, updateExpense)

router.delete('/deleteExpense', protectedRoute, deleteExpense)

router.get('/getAllExpense', protectedRoute, getAllExpense)

module.exports=router