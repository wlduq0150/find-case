import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { SendAskDto } from "./dto/send-ask.dto";

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        const isConnect = this.configService.get<string>("EMAIL_USER");

        if (isConnect) {
            this.transporter = nodemailer.createTransport({
                host: "smtp.naver.com",
                port: 587,
                secure: false,
                auth: {
                    user: this.configService.get<string>("EMAIL_USER"),
                    pass: this.configService.get<string>("EMAIL_PASS"),
                },
            });
        }
    }

    async sendMail(sendAskDto: SendAskDto) {
        const { title, text } = sendAskDto;

        const mailOptions = {
            from: this.configService.get<string>("EMAIL_USER"),
            to: this.configService.get<string>("EMAIL_USER"),
            subject: title,
            text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
            return info;
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
}
