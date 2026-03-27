import { CookieOptions, Response } from "express";
import type { IUser } from "../Model/user.model.js";
import jwt, { Secret } from 'jsonwebtoken'
import { setCache } from "../Utils/redis.cache.js";
import dotenv from 'dotenv'
dotenv.config()

export const SendCookie = async (user:IUser,statusCode:number,res:Response, flag?:boolean)=>{
    const access_Token = jwt.sign({id:user?._id},process.env.ACCESS_TOKEN as string , {expiresIn:'10m'})
    const refresh_Token = jwt.sign({id:user?._id},process.env.REFRESH_TOKEN as string, {expiresIn:'7d'})

    const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES as string ,10) * 60 *  1000
    const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES as string ,10) * 24 * 60 * 60 * 1000

    if(!flag){
        await setCache(`user:${user._id}`, user)
    }

    const accessTokenOptions:CookieOptions = {
        maxAge : accessTokenExpires,
        httpOnly : true,
        // secure:process.env.NODE_ENV === 'production',
        secure:true,
        sameSite:'none'
    }
    const refreshTokenOptions:CookieOptions = {
        maxAge : refreshTokenExpires,
        httpOnly : true,
        // secure:process.env.NODE_ENV === 'production',
        secure:true ,
        sameSite:'none'
    }

    res.cookie('access_token',access_Token,accessTokenOptions)
    res.cookie('refresh_token',refresh_Token,refreshTokenOptions)
    return res.status(statusCode).json({
        success:true,
        data:user,
        accessToken:access_Token
    })

}
