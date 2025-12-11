import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const ErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
    //here type ErrorRequestHandler is considered as 
    // type ErrorRequestHandler = (err:any, req:Request, res:Response, next:NextFunction)=>void
    const message = err.message || 'Internal Server Error'
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        success:false,
        message:message
    })
}