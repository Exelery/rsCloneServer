import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config()

export default class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
            
        })
    }

    async sendActivationMail(to, link) {
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
        console.log('message was sent')
    }
    
    async sendPassword(to, password) {
        const answer = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Восстановление пароля' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Ваш временный пароль</h1>
                        <p>${password}</p>
                    </div>
                `
        })
        console.log('password was sent')
    }
}