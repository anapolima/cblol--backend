/* eslint-disable max-classes-per-file */
import { Response } from "express";

enum ErrorType
{
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

class RequestError extends Error
{
    constructor (public type: number, public msg: object)
    {
        super(JSON.stringify(msg));
    }

    // eslint-disable-next-line class-methods-use-this
    public handle (res: Response, err: RequestError)
    {
        res.status(err.type).json(JSON.parse(err.message));
    }
}

class BadRequest extends RequestError
{
    constructor (message: object = { detail: "Bad request" })
    {
        super(ErrorType.BAD_REQUEST, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }

}

class Unauthorized extends RequestError
{
    constructor (message: object = { detail: "Unauthorized" })
    {
        super(ErrorType.UNAUTHORIZED, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class Forbidden extends RequestError
{
    constructor (message: object = { detail: "Forbidden" })
    {
        super(ErrorType.FORBIDDEN, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class NotFound extends RequestError
{
    constructor (message: object = { detail: "Not found" })
    {
        super(ErrorType.NOT_FOUND, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class UnprocessableEntity extends RequestError
{
    constructor (message: object = { detail: "Unprocessable entity" })
    {
        super(ErrorType.UNPROCESSABLE_ENTITY, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class InternalServerError extends RequestError
{
    constructor (message: object = { detail: "Internal server error" })
    {
        super(ErrorType.INTERNAL_SERVER_ERROR, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class ServiceUnavailable extends RequestError
{
    constructor (message: object = { detail: "Service temporarily unavailable" })
    {
        super(ErrorType.SERVICE_UNAVAILABLE, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class Conflict extends RequestError
{
    constructor (message: object = { detail: "Conflict" })
    {
        super(ErrorType.CONFLICT, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

export {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    UnprocessableEntity,
    InternalServerError,
    ServiceUnavailable,
    Conflict
};
