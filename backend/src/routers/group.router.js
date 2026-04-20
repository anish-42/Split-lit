const express=require("express");
const protectedRoute = require("../middleware/auth.middleware");
const { getAllGroups, createGroup, deleteGroup, getGroup } = require("../controller/group.controller");
const router=express.Router();

router.get("/getAllGroups", protectedRoute, getAllGroups)

router.post('/createGroup', protectedRoute, createGroup)

router.delete('/deleteGroup/:groupId', protectedRoute, deleteGroup)

router.get("/getGroup/:groupId", protectedRoute, getGroup)

module.exports=router;