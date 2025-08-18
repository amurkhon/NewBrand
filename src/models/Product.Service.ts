import Errors from "../libs/Errors";
import { Product, ProductChosenInput, ProductInput, ProductInquiry } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Message } from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { shapeIntoMongoObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enum/product.enum";
import { T } from "../libs/types/common";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enum/view.enum";
import ViewService from "./View.service";

class ProductService {
    private readonly productModel;
    private readonly viewService;
    constructor() {
        this.productModel = ProductModel;
        this.viewService = new ViewService();
    }
    /* SPA */
    
    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match: T ={ productStatus: ProductStatus.PROCESS };

        if(inquiry.productCollection)
            match.productCollection = inquiry.productCollection;
        if(inquiry.search)
            match.productName = { $regex: new RegExp(inquiry.search, "i")};

        const sort: T = inquiry.order === "productPrice" 
            ? {[inquiry.order] : 1 }
            : {[inquiry.order] : -1 };

        const result = await this.productModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: (inquiry.page*1 - 1)*inquiry.limit},
                { $limit: inquiry.limit*1},
            ]).exec();

        if(!result)
            throw new Errors (HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        
        return result;
    };

    public async getProduct(memberId: ObjectId, id: string): Promise<Product> {
        const productId = shapeIntoMongoObjectId(id);

        let result = await this.productModel.findOne({_id: productId, productStatus: ProductStatus.PROCESS});
        
        if(!result)
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        if(memberId) {
            // Check Existence
            const input: ViewInput = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: ViewGroup.PRODUCT,
            };
            const existView = await this.viewService.checkViewExistence(input);

            // Insert New View
            if(!existView) {
                console.log("Planning to insert new View");
                await this.viewService.insertMemberView(input);

                // Increase Counts
                result = await this.productModel
                .findByIdAndUpdate(
                    productId,
                    {$inc: {productViews: +1} },
                    {new: true}
                )
                .exec();
            }

        }

        return result;
    };

    /* SSR */

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