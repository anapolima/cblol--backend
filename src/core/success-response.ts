/* eslint-disable max-classes-per-file */
import { Response } from "express";

enum ResponseStatus
{
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202
}

abstract class RequestResponse
{
    protected sendData: string;

    constructor (
        public type: ResponseStatus,
        public data: object
    )
    {
        this.sendData = JSON.stringify(data);
    }

    // eslint-disable-next-line class-methods-use-this
    public handle (res: Response, response: RequestResponse)
    {
        res.status(response.type).json(JSON.parse(response.sendData));
    }

}

class StatusOK extends RequestResponse
{
    constructor (message: object = { detail: "Success OK" })
    {
        super(ResponseStatus.OK, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class StatusCreated extends RequestResponse
{
    constructor (message: object = { detail: "Created successfully" })
    {
        super(ResponseStatus.CREATED, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

class StatusAccepted extends RequestResponse
{
    constructor (message: object = { detail: "Accepted successfully" })
    {
        super(ResponseStatus.ACCEPTED, message);
    }

    send (res: Response)
    {
        return super.handle(res, this);
    }
}

export {
    StatusOK,
    StatusCreated,
    StatusAccepted
};
