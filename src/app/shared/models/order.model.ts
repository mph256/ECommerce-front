import { Address } from "./address.model";
import { DeliveryOption } from "./delivery-option.model";
import { User } from "./user.model";
import { Suborder } from "./suborder.model";

export class Order {

    constructor(public id: number,
        public amount: number,
        public orderDate: Date,
        public deliveryDate: Date,
        public shippingAddress: Address,
        public deliveryOption: DeliveryOption,
        public user: User,
        public suborders: Suborder[]) { }

}
