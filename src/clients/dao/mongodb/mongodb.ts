import { config } from "../../../config";
import mongoose from "mongoose";

class MongoDB
{
    public readonly mongoose = mongoose;
    public readonly mongoUri = config.mongoUrl;

    public async connect ()
    {
        await this.mongoose.connect(this.mongoUri);
    }

    public async disconnect ()
    {
        await this.mongoose.disconnect();
    }
}

export { MongoDB };
