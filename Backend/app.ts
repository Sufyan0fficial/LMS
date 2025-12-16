import express from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorHandler } from './MiddleWare/ErrorHandler.js'
import UserAuthRouter from './Routes/userAuth.route.js'

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json({limit:'50mb'}))



app.use('/api/v1/userAuth',UserAuthRouter)


app.use(ErrorHandler)

