import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { Member } from "../libs/types/member";
import OrderModel from "../schema/Order.model";
import { shapeIntoMongoObjectId } from "../libs/config";
import Errors from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import OrderItemModel from "../schema/OrderItem.model";
import { OrderStatus } from "../libs/enum/order.enum";
import MemberService from "./Member.service";




class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;

    constructor () {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberService = new MemberService();
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]
    ): Promise<Order> {
        const memberId = shapeIntoMongoObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;
        }, 0);

        const delivery = amount < 300 ? 15 : 0;

        try {
            const newOrder: Order = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
            });

            const orderId = newOrder._id;
            console.log("orderId: ", orderId);
            await this.recordOrderItem(orderId, input);
            return newOrder;
        } catch(err) {
            console.log("Error, model: createOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    private async recordOrderItem(
        orderId: ObjectId,
        input: OrderItemInput[]
    ): Promise<void> {
        const promisedList = input.map( async (item: OrderItemInput) => {
            item.orderId = orderId;
            item.productId = shapeIntoMongoObjectId(item.productId);
            await this.orderItemModel.create(item);
            return "INSERTED";
        });
        
        const orderItemsState = await Promise.all(promisedList);
        console.log("orderItemsState: ", orderItemsState);
    };

    public async getMyOrders(member: Member, inquiry: OrderInquiry): Promise<Order[]> {
        const memberId = shapeIntoMongoObjectId(member._id);
        const match = {memberId: memberId, orderStatus: inquiry.orderStatus};
        
        const result = await this.orderModel
            .aggregate([
                { $match: match },
                { $sort: {updatedAt: -1} },
                { $skip: (inquiry.page -1)*inquiry.limit },
                { $limit: inquiry.limit },
                {
                    $lookup: {
                        from: "orderItems",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "orderItems",
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "productData",
                    }
                }
            ]).exec();
        
        if(!result)
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    };

    public async updateOrder(
        member: Member,
        input: OrderUpdateInput
    ): Promise<Order> {
        const memberId = shapeIntoMongoObjectId(member._id);
        const orderId = shapeIntoMongoObjectId(input.orderId);

        const result = await this.orderModel
            .findOneAndUpdate(
                { memberId: memberId, _id: orderId },
                {orderStatus: input.orderStatus},
                {new: true})
            .exec();
        
        if(!result)
            throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        
        if(result?.orderStatus === OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(memberId, 1);
        };
        return result;
    };
}

export default OrderService;