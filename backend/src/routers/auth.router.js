const express=require("express");
const { authSignUp, authSignIn, authLogout, authCheck, addParticipant, getUser } = require("../controller/auth.controller");
const protectedRoute = require("../middleware/auth.middleware");
const router=express.Router();

router.post('/signUp', authSignUp)

router.post("/signIn", authSignIn)

router.post("/logout", protectedRoute, authLogout)

router.get("/check", protectedRoute, authCheck)

router.post("/addParticipant", protectedRoute, addParticipant)

router.get("/getUser/:id", protectedRoute, getUser)

module.exports=router