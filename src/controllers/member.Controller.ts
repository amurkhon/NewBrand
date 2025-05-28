import { T } from "../libs/types/common";
import { Request, Response } from "express";


const memberController: T = {};

memberController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
        res.send("Done!");

    } catch(err) {
        console.log("Error, goHome: ", err);
    }
};

memberController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup");
        res.send("getSignup");

    } catch(err) {
        console.log("Error, getSignup: ", err);
    }
};

memberController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin");
        res.send("getLogin");

    } catch(err) {
        console.log("Error, getLogin: ", err);
    }
};

export default memberController;