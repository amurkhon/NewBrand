import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enum/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { json } from "stream/consumers";

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

        res.render('signup');
    } catch (err) {
        console.log("Error, getSignup: ",err);
    }
};

mallController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin ");

        res.render('login');
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

mallController.verifyMall = async(
    req: AdminRequest,
    res: Response,
    next: NextFunction,
) => {
    if(req?.session?.member?.memberType === MemberType.MALL){
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script>alert("${message}"); window.location.replace('/admin/login');</script>`);
    }
};

mallController.getUsers = async (req: AdminRequest, res: Response) => {
    try {
        const result = await memberService.getUsers();

        res.render('users', {members: result});

    } catch(err) {
        console.log('Error, getUsers: ', err);
        res.redirect('/admin/login');
    }
};

mallController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log('updateChosenUser');
        const result = await memberService.updateChosenUser(req.body);
        res.status(HttpCode.OK).json({data: result});
    } catch (err) {
        console.log('Error, updateChosenUser: ', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
}





export default mallController;