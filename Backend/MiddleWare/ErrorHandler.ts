import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const ErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
    const message = err.message || 'Internal Server Error'
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        success:false,
        message:message
    })
}