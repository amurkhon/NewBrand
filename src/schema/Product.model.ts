import mongoose, { Schema } from "mongoose";
import { DownsideSize, Gender, ProductCollelction, ProductColor, ProductMaterial, ProductStatus, ShoesSize, UpsideSize } from "../libs/enum/product.enum";



const productSchema = new Schema(
    {
        productStatus: {
            type: String,
            enum: ProductStatus,
            default: ProductStatus.PAUSE,
        },

        productCollection: {
            type: String,
            enum: ProductCollelction,
            required: true,
        },

        productName: {
            type: String,
            require: true,
        },

        productPrice: {
            type: Number,
            require: true,
        },

        productLeftCount: {
            type: Number,
            required: true,
        },

        productSize: {
            type: String,
            enum: [
                ...Object.values(DownsideSize), 
                ...Object.values(UpsideSize), 
                ...Object.values(ShoesSize), 
            ],
            require: true,
        },
        productColor: {
            type: String,
            enum: ProductColor,
            require: true,
        },

        productMaterial: {
            type: String,
            enum: ProductMaterial,
            default: ProductMaterial.OTHER,
        },

        productInGender: {
            type: String,
            enum: Gender,
            require: true,
        },

        productDesc: {
            type: String,
            required: true,
        },

        productImages: {
            type: [String],
            default: [],
        },

        productViews: {
            type: Number,
            default: 0,
        },

    }, { timestamps: true }
);

productSchema.index(
    {
        productName: 1, 
        productSize: 1, 
        productGender: 1, 
        productColor: 1,
        productMaterial: 1,
    }
);
export default mongoose.model('Product', productSchema);