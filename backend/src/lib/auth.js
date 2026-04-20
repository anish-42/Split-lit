const jwt=require("jsonwebtoken")
const { model } = require("mongoose")

const generateToken=(res,userId)=>{
    try {
        const token=jwt.sign({userId}, process.env.JWT,{
            expiresIn: '7d'
        })
        res.cookie('jwt',token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV!='development'
        })
        return token
    } catch (error) {
        console.log("Error in generate token: ",error.message);
        res.status(401).json({message: "Internal server error!!"});
    }
}

module.exports=generateToken