import {
    DateValidator,
    EqualPasswordValidator,
    UserDocumentValidator,
    UserEmailValidator,
    UserNameValidator,
    UserPasswordValidator,
    UserTypeValidator,
} from ".";
import { IUser } from "../models";

class UserDataValidator
{
    public errors: Partial<IUser> = {};
    public user: Partial<IUser>;

    private readonly userFullnameValidator = UserNameValidator;
    private readonly userEmailValidator = UserEmailValidator;
    private readonly userDocumentValidator = UserDocumentValidator;
    private readonly userPasswordValidator = UserPasswordValidator;
    private readonly userEqualPasswordValidator = EqualPasswordValidator;
    private readonly userTypeValidator = UserTypeValidator;
    private readonly userBirthdateValidator = DateValidator;

    public constructor (_user: Partial<IUser>)
    {
        this.user = this.validate(_user);
    }

    private validate (_userData: Partial<IUser>): Partial<IUser>
    {
        const {
            fullname,
            email,
            password,
            confirmPassword,
            birthdate,
            document,
            type
        } = _userData;

        const validateBirthDate = new this.userBirthdateValidator(birthdate);
        const validateName = new this.userFullnameValidator(fullname);
        const validateDocument = new this.userDocumentValidator(document);
        const validatePassword = new this.userPasswordValidator(password);
        const validateConfirmPassword = new this.userEqualPasswordValidator(
            validatePassword.password, confirmPassword);
        const validateEmail = new this.userEmailValidator(email);
        const validateUserType = new this.userTypeValidator(type as string);

        this.errors = {
            ...validateName.errors,
            ...validateDocument.errors,
            ...validatePassword.errors,
            ...validateConfirmPassword.errors,
            ...validateEmail.errors,
            ...validateUserType.errors,
            ...validateBirthDate.errors,
        };

        return {
            fullname: validateName.fullname,
            birthdate: validateBirthDate.date,
            document: validateDocument.document,
            password: validateConfirmPassword.confirmPassword,
            email: validateEmail.email,
            type: validateUserType.type,
        };
    }
}

export { UserDataValidator };
