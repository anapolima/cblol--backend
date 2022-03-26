import { IUser } from "../models";

class DateValidator
{
    public errors: Partial<IUser> = {};
    public date: string;

    public constructor (_date: string)
    {
        this.date = this.validate(_date);
    }

    private validate (_date: string): string
    {
        const date: string = _date.trim();
        const regex = /\d{4}-\d{2}-\d{2}$/;

        if (regex.test(date))
        {
            const validDate = new Date(date);

            if (validDate.toJSON())
            {
                return date;
            }

            this.errors.birthdate = "Invalid date";

            return undefined;
        }

        this.errors.birthdate = "The date string must be on the format YYYY-MM-DD";

        return undefined;
    }
}

export { DateValidator };
