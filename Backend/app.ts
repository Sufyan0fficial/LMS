import express from 'express'
import type { NextFunction, Request, Response } from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorHandler } from './MiddleWare/ErrorHandler.js'
import UserAuthRouter from './Routes/userAuth.route.js'
import CoursesRouter from './Routes/course.route.js'
import OrderRouter from './Routes/order.route.js'
import NotificationRouter from './Routes/notification.route.js'
import AnalyticsRouter from './Routes/analytics.route.js'
import LayoutRouter from './Routes/layout.route.js'
import PaymentRouter from './Routes/payment.route.js'
import { customError } from './Utils/customError.js'



app.use(cors({
    origin: [`${process.env.FRONTEND_URL}`,'http://192.168.100.12:3001'],
    credentials:true    
}))

app.use(cookieParser())

app.use(express.json())



app.use('/api/v1/userAuth',UserAuthRouter)
app.use('/api/v1/courses',CoursesRouter)
app.use('/api/v1/order',OrderRouter)
app.use('/api/v1/notification',NotificationRouter)
app.use('/api/v1/analytics',AnalyticsRouter)
app.use('/api/v1/layout',LayoutRouter)
app.use('/api/v1/payment',PaymentRouter)

app.use((req:Request,res:Response,next:NextFunction)=>{
    if(req.path.startsWith('/api/v1')){
        return next(customError(404,'Requested api route does not exist'))
    }
    return next(customError(400,'Failed to process your request'))
})

app.use(ErrorHandler)
