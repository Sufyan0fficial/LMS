import nodemailer, { Transport, Transporter, TransportOptions } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const sendMail = async (options:any):Promise<void>=>{
    const transmitter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:true,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        },
        tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000, 
    } as {host:string, port:number, secure:boolean , auth:{user:string, pass:string},tls:{rejectUnauthorized:boolean},connectionTimeout:number}) 

    const mailOptions = {
        from:process.env.SMTP_MAIL || '',
        to:options.to || '',
        subject:options.subject || '',
        html:options.html || ''
    } as any

    await transmitter.sendMail(mailOptions)
}

