const express=require("express")
const dotenv=require("dotenv");
const cookieParser=require('cookie-parser')
const connectDb = require("./lib/mongo");
dotenv.config();
const cors=require("cors")
const authRouter=require('./routers/auth.router')
const expenseRouter=require('./routers/expense.router')
const transactionRouter=require('./routers/transaction.router')
const groupRouter=require('./routers/group.router')
const path=require("path")

const app=express();
const _dirname=path.resolve()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use('/api/v/auth',authRouter)
app.use('/api/v/expense',expenseRouter)
app.use('/api/v/transaction',transactionRouter)
app.use('/api/v/group',groupRouter)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")))
    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve(_dirname,"../frontend","dist","index.html"))
    })
}

app.listen(5000,()=>{
    console.log(`Listening at port no. ${5000}`)
    connectDb();
})