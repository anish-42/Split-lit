const express=require("express");
const protectedRoute = require("../middleware/auth.middleware");
const { getAllTransaction, getTransaction, getGroupTransaction } = require("../controller/transaction.controller");
const router=express.Router();

router.get('/getAllTransaction', protectedRoute, getAllTransaction)

router.get('/getTransaction/:secondUser', protectedRoute, getTransaction)

router.get('/getGroupTransaction/:groupId', protectedRoute, getGroupTransaction)

module.exports=router