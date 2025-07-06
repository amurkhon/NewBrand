import Errors, { Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";


export const productController: T = {};


productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
    } catch (err) {
        console.log('Error, getAllProducts: ', err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all) </script>`);
    }
}