import { BadRequest, InternalServerError } from "../core";
import { EncryptPasswd, TokenGenerator } from "../helpers";
import { IEmailStatus, SendEmailService } from "./send-email";
import { IUser, UserModel } from "../models";
import { MongoUsers } from "../clients";
import { UserDataValidator } from "../validators";
import { config } from "../config";

class CreateUserService
{
    private readonly userDataValidator = UserDataValidator;
    private readonly database = MongoUsers;
    private readonly passwdEncryptor = EncryptPasswd;
    private readonly tokenGenerator = TokenGenerator;
    private readonly emailSender = SendEmailService;
    private errors: Partial<IUser>;
    private user: Partial<IUser>;

    public constructor ()
    {
        this.errors = {};
    }

    public async execute (_userData: Partial<IUser>):
    Promise<IEmailStatus>
    {
        const validUserData = new this.userDataValidator(_userData);

        this.errors = { ...validUserData.errors };
        this.user = { ...validUserData.user };

        if (Object.keys(this.errors).length !== 0)
        {
            throw new BadRequest({
                detail: "Invalid user data",
                fields: { ...this.errors }
            });
        }

        try
        {
            this.user.encryptedPassword = await new this.passwdEncryptor(this.user.password).password;

            this.user = new UserModel(this.user);

            const registeredDocument = await new this.database().listUsersData({
                filters: { document: this.user.document }
            });

            const registeredEmail = await new this.database().listUsersData({
                filters: { email: this.user.email }
            });

            if (registeredDocument.totalCount.count !== 0)
            {
                registeredDocument.data.forEach((data) =>
                {
                    if (data.activated_at && !data.inactivated_at)
                    {
                        this.errors.document = "Document already registered";
                    }
                });
            }
            if (registeredEmail.totalCount.count !== 0)
            {
                registeredEmail.data.forEach((data) =>
                {
                    if (data.activated_at && !data.inactivated_at)
                    {
                        this.errors.email = "Email already registered";
                    }
                });
            }

            if (Object.keys(this.errors).length !== 0)
            {
                throw new BadRequest({
                    detail: "Invalid user data",
                    fields: { ...this.errors }
                });
            }

            const confirmEmailCode = new this.tokenGenerator(
                this.user.username,
                this.user.document,
                new Date().getTime()
                    .toString());

            this.user.confirm_email_code = confirmEmailCode.token;

            if (registeredEmail.data.length !== 0)
            {
                await new this.database().updateUserData({
                    id: registeredEmail.data[0].id,
                    confirm_email_code: this.user.confirm_email_code,
                    updated_at: new Date().toJSON()
                });

                return await this.sendEmail();
            }

            const insertedUsers = await new this.database().insertUsers([ this.user ]);

            if (insertedUsers.length !== 0)
            {
                return await this.sendEmail();
            }
        }
        catch (err)
        {
            const errorType = err.constructor.name;

            switch (errorType)
            {
                case "InternalServerError":
                case "ServiceUnavailable":
                case "BadRequest":
                    throw err;
                default:
                    throw new InternalServerError({
                        detail: "Couldn't insert user",
                        message: err.message
                    });
            }
        }
    }

    private async sendEmail ():
    Promise<IEmailStatus>
    {
        const sendEmail = new this.emailSender();

        await sendEmail.execute({
            from: config.emailSender.email,
            to: this.user.email,
            subject: "CBLoL-Events Confirmação de e-mail",
            // eslint-disable-next-line max-len
            text: `Para confirmar seu email clique no link abaixo:\n\n http://localhost:${config.port}/email/confirm?token=${this.user.confirm_email_code}`
        });

        return sendEmail.status;
    }
}

export { CreateUserService };
