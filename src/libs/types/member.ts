import { ObjectId } from 'mongoose';
import { MemberStatus, MemberType } from "../enum/member.enum";

export interface Member {
    _id: ObjectId;
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone:string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberInput {
    memberType?: string;
    memberStatus?: string;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberImage?: string;
    memberPoints?: number;
    memberAddress?: string;
    memberDesc?: string;
}

export interface LoginInput {
    memberNick: string;
    memberPassword: string;
}