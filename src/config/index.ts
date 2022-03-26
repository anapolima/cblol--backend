import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    bcryptSalt: process.env.BCRYPT_PASSWD_SALT || 10,
    codeGenerator: process.env.CODE_GENERATOR_LENGHT || 30,
    jwtSecret: process.env.JWT_SECRET as string,
    emailSender: {
        host: process.env.EMAIL_HOST as string,
        authType: process.env.AUTH_TYPE as string,
        email: process.env.EMAIL as string,
        password: process.env.EMAIL_WORD as string
    },
    oAuth: {
        clientId: process.env.OAUTH_CLIENT_ID as string,
        clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN as string,
        accessToken: process.env.OAUTH_ACCESS_TOKEN as string
    },
    whiteList: [ process.env.FRONTEND_URL ],
    mongoUrl: process.env.MONGODB_URL as string,
    pagination: {
        events: {
            itemsPerPage: process.env.EVENTS_ITEMS_PER_PAGE || 16,
            pageNumber: process.env.EVENTS_PAGE_NUMBER || 0
        },
        users: {
            itemsPerPage: process.env.USERS_ITEMS_PER_PAGE || 25,
            pageNumber: process.env.USERS_PAGE_NUMBER || 0
        }
    },
};
