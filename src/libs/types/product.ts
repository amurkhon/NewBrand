import { ObjectId } from "mongoose";
import { DownsideSize, Gender, ProductCollelction, ProductColor, ProductMaterial, ProductStatus, ShoesSize, UpsideSize } from "../enum/product.enum";

export interface Product {
    _id: ObjectId,
    productStatus: ProductStatus,
    productCollection: ProductCollelction,
    productName: string,
    productPrice: number,
    productLeftCount: number,
    productSize: UpsideSize | DownsideSize | ShoesSize,
    productColor: ProductColor,
    productMaterial: ProductMaterial,
    productInGender: Gender,
    productDesc: string,
    productImages: string[],
    productViews: number,
    createdAt: Date,
    updatedAt: Date,
};

export interface ProductInquiry {
    order: string;
    page: number;
    limit: number;
    productCollection?: ProductCollelction;
    search?: string;
}

export interface ProductInput {
    productStatus?: ProductStatus,
    productCollection: ProductCollelction,
    productName: string,
    productPrice: number,
    productLeftCount: number,
    productSize: UpsideSize | DownsideSize | ShoesSize,
    productColor: ProductColor,
    productMaterial?: ProductMaterial,
    productInGender: Gender,
    productDesc: string,
    productImages?: string[],
    productViews?: number,
}

export interface ProductChosenInput {
    productStatus?: ProductStatus,
    productCollection?: ProductCollelction,
    productName?: string,
    productPrice?: number,
    productLeftCount?: number,
    productSize?: UpsideSize | DownsideSize | ShoesSize,
    productColor?: ProductColor,
    productMaterial?: ProductMaterial,
    productInGender?: Gender,
    productDesc?: string,
    productImages?: string[],
    productViews?: number,
}