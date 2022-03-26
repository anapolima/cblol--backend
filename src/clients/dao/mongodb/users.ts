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

    private readonly filters = {
        document: (_document: string) =>
        {
            this.match[UsersFields.DOCUMENT] = _document;
        },
        email: (_email: string) =>
        {
            this.match[UsersFields.EMAIL] = _email;
        },
        username: (_username: string) =>
        {
            this.match[UsersFields.USERNAME] = _username;
        },
        id: (_id: string) =>
        {
            this.match[UsersFields._ID] = new mongoose.Types.ObjectId(_id);
        },
        confirm_email_code: (_confirm_email_code: string) =>
        {
            this.match[UsersFields.CONFIRM_EMAIL_CODE] = _confirm_email_code;
        }
    };

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

            await this.disconnect();

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

            await this.mongoose.disconnect();
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

        Object.keys(this.listUsersDataOptions.filters).forEach((_field: string) =>
        {
            const setFilter = this.filters[_field];

            if (setFilter)
            {
                setFilter(this.listUsersDataOptions.filters[_field]);
            }
        });

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
