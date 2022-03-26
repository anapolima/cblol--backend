import { IPagination, IUser, PaginationSort } from ".";

interface IListUsersDataOptions
{
    filters: Partial<IUser>,
    pagination: IPagination,
    sort: PaginationSort | string,
    sortBy: string;
    showDeleted: boolean
}

export { IListUsersDataOptions };
