const generateToken = require("../lib/auth");
const User = require("../models/auth.model");
const bcrypt=require("bcrypt")

const authSignUp=async (req,res)=>{
    try {
        const {fullName, userName, email, password}=req.body
        if(!fullName || !userName || !email || !password){
            res.status(400).json({message: "Fields are missing!!"})
            return ;
        }
        let user=await User.findOne({userName})
        if(user){
            res.status(401).json({message: "Username is already taken!!"});
            return ;
        }
        user=await User.findOne({email})
        if(user){
            res.status(401).json({message: "Email is already used!!"});
            return ;
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            userName,
            email,
            password: hashedPassword
        })
        if(!newUser){
            res.status(401).json({message: "Internal server error!!"});
            return ;
        }
        generateToken(res,newUser._id);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName,
            userName,
            email,
            groups: newUser.groups
        })
    } catch (error) {
        console.log("Error in signUp controller: ",error)
        res.status(401).json({message: "Internal server error!"})
    }
}

const authSignIn=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            res.status(401).json({message: "Fields are missing!!"});
            return ;
        }
        const user=await User.findOne({email}).populate({path: 'groups'})
        if(!user){
            res.status(401).json({message: "Invalid credentials!!"});
            return ;
        }
        const check=await bcrypt.compare(password, user.password);
        if(!check){
            res.status(401).json({message: "Invalid credentials!!"});
            return ;
        }
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: email,
            groups: user.groups
        })
    } catch (error) {
        console.log("Error in signIn controller: ",error.message)
        res.status(401).json({message: "Internal server error"});
    }
}

const authLogout=async (req,res)=>{
    try {
        res.cookie('jwt','',{
            maxAge: 0,
        })
        res.status(201).json({message: "Successfully logged out!!"});
    } catch (error) {
        console.log("Error in logout controller: ",error.message)
        res.status(401).json({message: "Internal server error!"});
    }
}

const authCheck=async (req,res)=>{
    try {
        res.status(201).json(req.user);
    } catch (error) {
        console.log("Error in auth check: ",error.message)
        res.status(401).json({message: "Internal server error!"})
    }
}

const addParticipant=async (req,res)=>{
    try {
        const {userName}=req.body
        if(!userName){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const user=await User.findOne({userName}).select("-password")
        if(!user){
            res.status(402).json({message: "Invalid username!"})
            return ;
        }
        res.status(201).json(user)
    } catch (error) {
        console.log("Error in addParticipant controller: ",error.message)
        res.status(401).json({message: "Internal server error!"})
    }
}

const getUser=async (req,res)=>{
    try {
        const {id}= req.params;
        if(!id){
            res.status(401).json({message: "Fields are missing!"})
            return ;
        }
        const user=await User.findOne({_id: id}).select("-password");
        if(!user){
            res.status(401).json({message: "Invalid userName!"});
            return ;
        }
        res.status(201).json(user);
    } catch (error) {
        console.log("Error in getUser controller: ",error.message)
        res.status(401).json({message: "Internal server error!!!"});
    }
}

module.exports={
    authSignUp,
    authSignIn,
    authLogout,
    authCheck,
    addParticipant,
    getUser
}