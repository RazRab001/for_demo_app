import nodemailer, {TransportOptions} from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

class MailService{
    private transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        } as TransportOptions);
    }

    async sendMail(email: string, link: string){
        return await this.transporter.sendMail({
            from: `SuperShop ${process.env.SMTP_SENDER}`,
            to: email,
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                        <a href='${link}'>${link}</a>
                </div>
            `,
        })
    }
}

export = new MailService()