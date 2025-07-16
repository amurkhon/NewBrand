import { LoginInput, MemberInput } from "../libs/types/member";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import Errors, { HttpCode } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIME } from "../libs/config";


const memberController: T = {};

const memberService = new MemberService();

const authService = new AuthService();

memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body,
            result = await memberService.signup(input);
        const token = await authService.createToken(result);

        res.cookie('accessToken', token, {
            maxAge: AUTH_TIME * 3600 * 1000,
            httpOnly: false,
        });
        res.status(HttpCode.OK).json({member: result, accesToken: token});
    } catch (err) {
        console.log("Error, signup: ", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
}

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");
        const input: LoginInput = req.body,
            result = await memberService.login(input);
        const token = await authService.createToken(result);

        res.cookie('accessToken', token, {
            maxAge: AUTH_TIME * 3600 * 1000,
            httpOnly: false,
        });
        res.status(HttpCode.OK).json({member: result, accessToken: token});
    } catch (err) {
        console.log("Error, login: ", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
}

memberController.logout = async (req: Request, res: Response) => {
    try {
        console.log("logout");
        res.cookie('accessToken', null, {maxAge: 0, httpOnly: false} );
        res.status(HttpCode.OK).json({logout: true});

    } catch (err) {
        console.log("Error, logout: ", err);
        if (err instanceof Errors) return res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
}



export default memberController;