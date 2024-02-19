import { Product } from "./product.model";

export class Item {

    constructor(public quantity: number,
        public isGift: boolean,
        public price: number,
        public product: Product,
        public id?: number) { }

}
