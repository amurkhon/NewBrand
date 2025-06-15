import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enum/member.enum";

const mallController: T = {};

const memberService = new MemberService();


mallController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome ");

        res.send('goHome');
    } catch (err) {
        console.log("Error, goHome: ",err);
    }
};

mallController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup ");

        res.send('signup page');
    } catch (err) {
        console.log("Error, getSignup: ",err);
    }
};

mallController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log("processSigup ");
        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.MALL;
        const result = await memberService.processSignup(newMember);

        res.status(200).json(result);
    } catch (err) {
        console.log("Error, processSignup: ",err);
    }
};

mallController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin ");

        res.send('login page');
    } catch (err) {
        console.log("Error, getLogin: ",err);
    }
};

mallController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log("processLogin ");
        const newMember: LoginInput = req.body;
        const result = await memberService.processLogin(newMember);

        res.status(200).json(result);
    } catch (err) {
        console.log("Error, processSignup: ",err);
    }
};



export default mallController;