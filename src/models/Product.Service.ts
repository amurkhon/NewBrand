import Errors from "../libs/Errors";
import { Product, ProductChosenInput, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Message } from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { ObjectId } from "mongoose";

class ProductService {
    private readonly productModel;
    constructor() {
        this.productModel = ProductModel;
    }
    
    public async getAllProducts(): Promise<Product[]> {
        const result = await this.productModel.find();

        if(!result)
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    };

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            return await this.productModel.create(input);
        } catch (err) {
            console.log("Error, model: createNewProduct: ", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    };

    public async updateChosenProduct(input: ProductChosenInput, id: ObjectId): Promise<Product> {
        const result = await this.productModel
            .findOneAndUpdate({_id: id}, input, {new: true})
            .exec();
        if(!result) throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);

        return result;
    }
}

export default ProductService;