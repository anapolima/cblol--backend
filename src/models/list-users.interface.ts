import { IUser } from "./user.interface";

interface IListUsers
{
    data: Partial<IUser[]>;
    totalCount: { count: number };
}

export { IListUsers };
