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
        if(exist)
            throw new Error('Creation failed!');
        
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
            if(!isMatch)
                throw new Error('Password is wrong!');
            return result.toJSON();

        } catch (err) {
            console.log('Error, processLogin: ', err)
        }
    }

}

export default MemberService;