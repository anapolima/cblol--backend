import {
    IListUsers,
    IListUsersDataOptions,
    IUser,
    PaginationSort,
    UserModel,
    UsersFields,
} from "../../../models";
import { InternalServerError, ServiceUnavailable } from "../../../core";
import mongoose, { PipelineStage } from "mongoose";
import { MongoDB } from ".";
import { config } from "../../../config";

class MongoUsers extends MongoDB
{
    private readonly Users = UserModel;
    private listUsersDataOptions: Partial<IListUsersDataOptions>;
    private users: IListUsers[] = [];
    private updateFields: Partial<IUser> = {};
    private match: Partial<IUser> = {};
    private sortBy: string;
    private query: PipelineStage[];

    public constructor ()
    {
        super();
        this.match.deleted_at = null;
    }

    public async insertUsers (_clients: Partial<IUser>[]): Promise<Partial<IUser>[]>
    {
        try
        {
            await this.connect();

            const inserted = await this.Users.insertMany(_clients);

            try
            {
                await this.disconnect();
            }
            catch (err)
            {
                throw new InternalServerError({
                    detail: "Unable to disconnect from database",
                    status: "Data inserted successfully",
                    message: err.message,
                });
            }

            return inserted;
        }
        catch (err)
        {
            const errorType = err.constructor.name;

            switch (errorType)
            {
                case "InternalServerError":
                    throw err;
                default:
                    throw new ServiceUnavailable({
                        detail: "Service temporarily unavailable",
                        message: err.message
                    });
            }
        }
    }

    public async listUsersData (
        _options: Partial<IListUsersDataOptions>,

    ): Promise<IListUsers>
    {
        try
        {
            this.query = this.usersQueryBuilder(_options);

            await this.connect();

            this.users = await this.Users.aggregate([ ...this.query ]);

            await this.disconnect();

            return this.users[0];
        }
        catch (err)
        {
            throw new InternalServerError({
                detail: "Unable to fetch users",
                message: err.message
            });
        }
    }

    public async updateUserData (_user: Partial<IUser>): Promise<Partial<IUser>[]>
    {
        try
        {
            const userId = _user._id;

            delete _user._id;

            Object.keys(_user).forEach((_key) =>
            {
                if (_key === UsersFields.ENCRYPTED_PASSWORD)
                {
                    this.updateFields.password = _user.encryptedPassword;
                }
                else
                {
                    if (_user[_key])
                    {
                        this.updateFields[_key] = _user[_key];
                    }
                }
            });

            await this.connect();

            await this.Users.updateOne({
                _id: userId
            }, {
                $set: {
                    ...this.updateFields
                }
            });

            try
            {
                await this.mongoose.disconnect();
            }
            catch (err)
            {
                throw new InternalServerError({
                    detail: "Unable to disconnect from database",
                    status: "Data updated successfully",
                    message: err.message,
                });
            }

            delete this.updateFields.password;

            return [ this.updateFields ];
        }
        catch (err)
        {
            const errorType = err.constructor.name;

            switch (errorType)
            {
                case "InternalServerError":
                    throw err;
                default:
                    throw new ServiceUnavailable({
                        detail: "Service temporarily unavailable",
                        message: err.message
                    });
            }
        }
    }

    private usersQueryBuilder (_options: Partial<IListUsersDataOptions>): PipelineStage[]
    {
        this.listUsersDataOptions = { ..._options };

        if ( this.listUsersDataOptions.showDeleted)
        {
            this.match.deleted_at = { $ne: null };
        }

        if ( this.listUsersDataOptions.filters?.document)
        {
            this.match[UsersFields.DOCUMENT] = this.listUsersDataOptions.filters.document;
        }
        if (this.listUsersDataOptions.filters?.email)
        {
            this.match[UsersFields.EMAIL] = this.listUsersDataOptions.filters.email;
        }
        if ( this.listUsersDataOptions.filters?.username)
        {
            this.match[UsersFields.USERNAME] = this.listUsersDataOptions.filters.username;
        }
        if ( this.listUsersDataOptions.filters?.id)
        {
            this.match[UsersFields._ID] = new mongoose.Types.ObjectId(this.listUsersDataOptions.filters.id);
        }
        if ( this.listUsersDataOptions.filters?.fullname)
        {
            this.match[UsersFields.FULLNAME] = this.listUsersDataOptions.filters.fullname;
        }
        if ( this.listUsersDataOptions.filters?.birthdate)
        {
            this.match[UsersFields.BIRTH_DATE] = this.listUsersDataOptions.filters.birthdate;
        }
        if ( this.listUsersDataOptions.filters?.confirm_email_code)
        {
            this.match[UsersFields.CONFIRM_EMAIL_CODE] = this.listUsersDataOptions.filters.confirm_email_code;
        }

        switch (this.listUsersDataOptions.sortBy)
        {
            case UsersFields.ID:
                this.sortBy = UsersFields._ID;
                break;
            default:
                this.sortBy = this.listUsersDataOptions.sortBy;
                break;
        }

        if (this.sortBy)
        {
            const sortBy = {};
            sortBy[this.sortBy] = this.listUsersDataOptions.sort || PaginationSort.ASC;

            return [
                {
                    $facet: {
                        data: [
                            {
                                $project: {
                                    _id: true,
                                    fullname: true,
                                    username: true,
                                    document: true,
                                    email: true,
                                    birthDate: true,
                                    type: true,
                                    activated_at: true,
                                    inactivated_at: true,
                                    updated_at: true,
                                    deleted_at: true,
                                    username_updated: true,
                                }
                            },
                            {
                                $match: {
                                    ...this.match
                                }
                            },
                            {
                                $skip: (this.listUsersDataOptions.pagination?.itemsPerPage ||
                                    Number(config.pagination.users.itemsPerPage)) * (
                                    this.listUsersDataOptions.pagination?.pageNumber ||
                                    Number(config.pagination.users.pageNumber)
                                )
                            },
                            {
                                $limit: this.listUsersDataOptions.pagination?.itemsPerPage ||
                                Number(config.pagination.users.itemsPerPage)
                            },
                            {
                                $sort: { ...sortBy }
                            }
                        ],
                        totalCount: [
                            {
                                $match: {
                                    ...this.match
                                }
                            },
                            {
                                $group: {
                                    _id: "id",
                                    count: { $count: {} }
                                }
                            }
                        ]
                    }
                }
            ];
        }

        return [
            {
                $facet: {
                    data: [
                        {
                            $match: {
                                ...this.match
                            },
                        },
                        {
                            $skip: (this.listUsersDataOptions.pagination?.itemsPerPage ||
                                Number(config.pagination.users.itemsPerPage)) * (
                                this.listUsersDataOptions.pagination?.pageNumber ||
                                Number(config.pagination.users.pageNumber)
                            )
                        },
                        {
                            $limit: this.listUsersDataOptions.pagination?.itemsPerPage ||
                                Number(config.pagination.users.itemsPerPage),
                        },
                    ],
                    totalCount: [
                        {
                            $match: {
                                ...this.match
                            }
                        },
                        {
                            $group: {
                                _id: "id",
                                count: { $count: {} }
                            }
                        }
                    ]
                }
            },


        ];
    }
}

export { MongoUsers };
