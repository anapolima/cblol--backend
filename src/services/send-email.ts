import { IMailOptions } from "../models";
import { InternalServerError } from "../core";
import { config } from "../config";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface IEmailStatus
{
    code: number;
    message: string;
}

enum Status
{
    SEND = 200,
}

class SendEmailService
{
    public status: IEmailStatus;
    private emailOptions: IMailOptions;

    public async execute (_mailOptions: IMailOptions)
    {
        _mailOptions.from = config.emailSender.email;

        this.emailOptions = { ..._mailOptions };

        try
        {
            await this.sendEmail();
            this.status = {
                code: Status.SEND,
                message: "Email sent successfully!"
            };
        }
        catch (err)
        {
            throw new InternalServerError({
                detail: "Unable to send email",
                message: err.message,
            });
        }

    }

    private async sendEmail ():
    Promise<void>
    {
        const transporter = createTransport({
            host: config.emailSender.host,
            secure: true,
            auth: {
                type: "oauth2",
                user: config.emailSender.email,
                clientId: config.oAuth.clientId,
                clientSecret: config.oAuth.clientSecret,
                refreshToken: config.oAuth.refreshToken,
            }
        });

        await transporter.sendMail(this.emailOptions);
    }
}

export { SendEmailService, IEmailStatus };
