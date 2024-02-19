import { Item } from "./item.model";

export class Suborder {

    constructor(public id: number,
        public status: string,
        public orderId: number,
        public items: Item[]) { }

}
