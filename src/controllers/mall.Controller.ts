import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enum/member.enum";
import Errors, { Message } from "../libs/Errors";

const mallController: T = {};

const memberService = new MemberService();


mallController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome ");

        res.render('home');
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

mallController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin ");

        res.send('login page');
    } catch (err) {
        console.log("Error, getLogin: ",err);
    }
};

mallController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSigup ");
        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.MALL;
        const result = await memberService.processSignup(newMember);

        req.session.member = result;
        req.session.save(() => {
            res.render('products');
        });
    } catch (err) {
        console.log("Error, processSignup: ",err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);
    }
};

mallController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin ");
        const newMember: LoginInput = req.body;
        const result = await memberService.processLogin(newMember);
        
        req.session.member = result;
        req.session.save(() => {
            res.render('products');
        });
    } catch (err) {
        console.log("Error, processSignup: ",err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);
    }
};

mallController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("logout");
        req.session.destroy(() => {
            res.redirect('/admin');
        })

    } catch (err) {
        console.log("Error: ", err);
        res.redirect('/admin')
    }
};

mallController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        if(req.session?.member) res.send(`<script> alert("Hi, ${req.session.member.memberNick}")</script>`);
        else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);

    } catch (err) {
        console.log("Error, processLogin: ", err);
        res.send(err);
    }
}



export default mallController;