import ProductService from "../models/Product.Service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { shapeIntoMongoObjectId } from "../libs/config";
import { AdminRequest } from "../libs/types/member";
import { ProductInput } from "../libs/types/product";


export const productController: T = {};

const productService = new ProductService();


productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        const result = await productService.getAllProducts();
        res.render('products', {data: result});
    } catch (err) {
        console.log('Error, getAllProducts: ', err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all) </script>`);
    }
};

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log('createNewProduct');
        if(!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
        
        const data: ProductInput = req.body;
        data.productImages = req.files?.map((ele) => {
            return ele.path.replace(/\\/g,"/");
        });

        await productService.createNewProduct(data);
        res.send(`<script> alert("Successful creation!"); window.location.replace('/admin/product/all') </script>`);
    } catch (err) {
        console.log("Error, createNewProduct: ", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all) </script>`);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log('updateChosenProduct');
        const id = shapeIntoMongoObjectId(req.params.id);
        const result = await productService.updateChosenProduct(req.body, id);
        res.render('products', {data: result});
    } catch (err) {
        console.log("Error, updateChosenProduct: ", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all) </script>`);
    }
}