import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enum/member.enum";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";


class MemberService {

    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    public async processSignup(input: MemberInput): Promise<Member> {

        const exist = await this.memberModel
        .findOne({memberType: MemberType.MALL})
        .exec();
        if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        
        // TODO: Hash password
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = '';
            return result.toJSON();

        } catch (err) {
            console.log('Error, processSignup: ', err)
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        try {
            const result = await this.memberModel.findOne({memberNick: input.memberNick});
            
            const isMatch = result.memberPassword === input.memberPassword;
            if(!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        };
            return result.toJSON();

        } catch (err) {
            console.log('Error, processLogin: ', err)
        }
    }

}

export default MemberService;