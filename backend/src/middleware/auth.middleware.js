const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

const protectedRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            res.status(401).json({message: "User unauthenticated!"});
            return ;
        }
        const verify=await jwt.verify(token, process.env.JWT);
        if(!verify){
            res.status(401).json({message: "Invalid token!!"});
            return ;
        }
        const user=await User.findById(verify.userId).select('-password').populate({path: 'groups'})
        if(!user){
            res.status(401).json({message: "Invalid token!"});
            return ;
        }
        req.user=user;
        next();
    } catch (error) {
        console.log("Error in protected route: ",error);
        res.status(401).json({message: "Internal server error!"});
    }
}

module.exports=protectedRoute