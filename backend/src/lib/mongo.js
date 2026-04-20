const mongoose=require("mongoose");

const connectDb=async ()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to user: ",connect.connection.host)
    } catch (error) {
        console.log("Error in connectDb: ",error)
    }
}

module.exports=connectDb