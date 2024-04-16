import { Global, Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";

@Global()
@Injectable()
export class MailService {
    private readonly transport = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_NAME,
            pass: process.env.MAIL_PASSWORD
        }
    })
    async sendMail(to: string, subject: string, html: string, from: string = process.env.MAIL_NAME) {
        let mailOptions = {
            from,
            to,
            subject,
            html
        }
        return this.transport.sendMail(mailOptions)
    }
}