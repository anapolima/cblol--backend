import { IMailOptions } from "../model";
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
            this.sendEmail();
            this.status = {
                code: Status.SEND,
                message: "Email sent successfully!"
            };
        }
        catch (err)
        {
            if (err instanceof InternalServerError)
            {
                throw err;
            }

            throw new InternalServerError({
                detail: "Unable to send email",
                message: err.message,
            });
        }

    }

    private  sendEmail ():
    Promise<IEmailStatus>
    {
        return new Promise( (res, rej) =>
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


            transporter.sendMail(this.emailOptions, (err) =>
            {
                if (err)
                {
                    const result = new InternalServerError({ detail: err.message });

                    rej(result);
                }
                else
                {
                    const result = {
                        code: Status.SEND,
                        message: "Email enviado com sucesso!"
                    };

                    res(result);
                }
            });
        });
    }
}

export { SendEmailService, IEmailStatus };
