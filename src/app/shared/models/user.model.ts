import { Address } from "./address.model";

export class User {

    constructor(public username: string,
        public email: string,
        public roles: string[],
        public firstname?: string,
        public lastname?: string,
        public phone?: number,
        public shippingAddress?: Address,
        public billingAddress?: Address) { }

}
