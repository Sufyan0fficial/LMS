    import { customError } from "../Utils/customError.js";
    import { AsyncWrapper } from "./AsyncWrapper.js";
    import jwt from 'jsonwebtoken'
    import dotenv from 'dotenv'
    import { redisClient } from "../Redis/init.redis.js";
    import { NextFunction } from "express";
    import { Request, Response } from "express";

    export const Verify_User = AsyncWrapper(async(req,res,next)=>{
        const cookie = req.cookies?.access_token
        if(!cookie){
            return next(customError(401,'Cookie Expired !'))
        }
        const user = jwt.verify(cookie,process.env.ACCESS_TOKEN as string) as {id:string}
        if(!user?.id){
            return next(customError(401,'Session Expired !'))
        }
        const redisUser = await redisClient.get(user?.id)
        if(!redisUser){
            return next(customError(400,'User not found'))
        }
        const userData = JSON.parse(redisUser)
        req.user = userData
        next()
    })

    export const Authorize_Role = (...roles:string[])=>{
        return (req:Request,res:Response,next:NextFunction)=>{
            if(!roles.includes(req.user?.role)){
                return next(customError(400,`Role "${req.user?.role}" is not allowed to access this feature`))
            }
            next()
        }
    }
