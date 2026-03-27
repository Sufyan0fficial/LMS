import { CookieOptions, Response } from "express";
import type { IUser } from "../Model/user.model.js";
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const SendCookie = async (user:IUser,statusCode:number,res:Response, flag?:boolean)=>{
    const access_Token = jwt.sign({id:user?._id},process.env.ACCESS_TOKEN as string , {expiresIn:'10m'})
    const refresh_Token = jwt.sign({id:user?._id},process.env.REFRESH_TOKEN as string, {expiresIn:'7d'})

    const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES as string ,10) * 60 *  1000
    const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES as string ,10) * 24 * 60 * 60 * 1000

    // In production (HTTPS, possibly cross-site) cookies must be SameSite=None; Secure.
    // In development over plain HTTP (frontend and backend on the same host, different ports => same-site)
    // use SameSite=Lax without Secure so browsers actually store and send the cookies.
    const isProduction = process.env.NODE_ENV === 'production'

    const accessTokenOptions:CookieOptions = {
        maxAge : accessTokenExpires,
        httpOnly : true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }
    const refreshTokenOptions:CookieOptions = {
        maxAge : refreshTokenExpires,
        httpOnly : true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }

    res.cookie('access_token',access_Token,accessTokenOptions)
    res.cookie('refresh_token',refresh_Token,refreshTokenOptions)
    return res.status(statusCode).json({
        success:true,
        data:user,
        accessToken:access_Token
    })

}
