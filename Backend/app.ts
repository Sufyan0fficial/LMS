import express from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorHandler } from './MiddleWare/ErrorHandler.js'

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json({limit:'50mb'}))



app.use((req,res)=>{
    if(req.path.startsWith('/api/')){
       return res.status(400).json({success:false,message:'API endpoint not found'})
    }  
})


app.use(ErrorHandler)

