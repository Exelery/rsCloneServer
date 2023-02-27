import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config()

export default class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            // host: process.env.SMTP_HOST,
            // port: process.env.SMTP_PORT,
            // secure: false,
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
            
        })
    }

    async sendActivationMail(to, link) {
      console.log( process.env.SMTP_USER,
        process.env.SMTP_PASSWORD)
        const answer = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
        console.log('message was sent', answer)
    }
}