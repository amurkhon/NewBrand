import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enum/member.enum";


const memberSchema = new Schema (
    {
        memberType: {
            type: String,
            enum: MemberType,
            default: MemberType.USER,
        },

        memberStatus: {
            type: String,
            enum: MemberStatus,
            default: MemberStatus.ACTIVE,
        },

        memberNick: {
            type: String,
            index: {unique: true, sparse: true},
            require: true,
        },

        memberPassword: {
            type: String,
            select: false,
            required: true,

        },

        memberPhone: {
            type: Number,
            index: {unique: true, sparse: true},
            require: true,
        },

        memberImage: {
            type: String,
        },

        memberPoints: {
            type: Number,
            default: 0,
        },

        memberAddress: {
            type: String,
        },

        memberDesc: {
            type: String,
        },
    }, 
    {
        timestamps: true
    }
);

export default mongoose.model('Member', memberSchema);