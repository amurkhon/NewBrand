import { shapeIntoMongoObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enum/member.enum";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import bcrypt from "bcryptjs";


class MemberService {

    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    /* SSR */ 

    public async processSignup(input: MemberInput): Promise<Member> {

        const exist = await this.memberModel
        .findOne({memberType: MemberType.MALL})
        .exec();
        if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        
        // TODO: Hash password
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = '';
            return result;

        } catch (err) {
            console.log('Error, processSignup: ', err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
        .findOne(
            {memberNick: input.memberNick},
            {memberNick: true, memberPassword: true}
        )
        .exec();
        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

        if(!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        return await this.memberModel.findById(member._id).exec();
    }

    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel
            .find({memberType: MemberType.USER})
            .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result;
    }

    public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
        const {_id} = input;
        const result = await this.memberModel
            .findByIdAndUpdate(_id, input, {new: true})
            .exec();
        
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }

    /* SPA */

    public async getMall(): Promise<Member> {
        const result = await this.memberModel
        .findOne({memberType: MemberType.MALL})
        .lean()
        .exec();

        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    };
    
    public async signup(input: MemberInput): Promise<Member> {

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = '';

            return result.toJSON();
        } catch (err) {
            console.log("Error, signup: ", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
    };

    public async login(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                {
                    memberNick: input.memberNick,
                    memberStatus: { $ne: MemberStatus.DELETE}
                },
                { memberNick: true, memberPassword: true, memberStatus: true }
            )
            .exec();
        if(!member) {
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        }
        else if(member.memberStatus === MemberStatus.BLOCK) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
        };

        const isMatch: Boolean = await bcrypt.compare(input.memberPassword, member.memberPassword);
        if(!isMatch) throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_PASSWORD);

        return await this.memberModel.findById(member._id).lean().exec();
    };

    public async getMemberDetail(member: Member): Promise<Member> {
       const memberId = shapeIntoMongoObjectId(member._id);
       const result = await this.memberModel.findOne({_id: memberId, memberStatus: MemberStatus.ACTIVE }).exec();

       if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

       return result;
    };

    public async updateMember(member: Member, input: MemberUpdateInput): Promise<Member> {
        const memberId = shapeIntoMongoObjectId(member._id);
        const result = await this.memberModel.findOneAndUpdate({_id: memberId}, input, {new: true}).exec();

        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    };

    public async getTopUsers(): Promise<Member[]>{
        
        const result = await this.memberModel
        .find({memberStatus: MemberStatus.ACTIVE})
        .gt("memberPoints", 10)
        .sort({"memberPoints": -1})
        .limit(4).exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    };

    public async addUserPoint(member: Member, point: number): Promise<Member> {
        const memberId = shapeIntoMongoObjectId(member._id);
        const result = await this.memberModel
            .findOneAndUpdate(
                { 
                    _id: memberId,
                    memberType: MemberType.USER,
                    memberStatus: MemberStatus.ACTIVE 
                },
                { $inc: { memberPoints: point } },
                { new: true }
            )
            .exec();
        
        if(!result)
            throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;
    };


}

export default MemberService;