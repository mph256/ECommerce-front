import { Item } from "./item.model";

export class Cart {

    constructor(public amount: number,
        public items: Item[],
        public id?: number) { }

}
