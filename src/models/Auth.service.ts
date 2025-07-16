import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIME } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";


class AuthService {
    private readonly secretToken;
    constructor(){
        this.secretToken = process.env.SECRET_TOKEN as string;
    }

    public async createToken(payload: Member) {
        return new Promise((resolve, reject) => {
            const duration = `${AUTH_TIME}h`;
            jwt.sign(
                payload,
                this.secretToken as string,
                { expiresIn: duration },
                (err, token) => {
                    if(err) reject (
                        new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
                    );
                    else resolve( token as string);
                }
            );
        })
    };

    public async verifyAuth(token: string): Promise<Member> {
        const result: Member = (await jwt.verify(token, this.secretToken)) as Member;
        
        return result;
    }


}

export default AuthService;