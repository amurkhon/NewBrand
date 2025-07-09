import mongoose from "mongoose"

export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === 'string' ? new mongoose.Types.ObjectId(target) : target;
};

export const MORGAN_FORMAT = ':method :url :res[content-length] - :response-time ms [:status]';