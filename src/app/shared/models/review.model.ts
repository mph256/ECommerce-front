import { User } from "./user.model";

export class Review {

    constructor(public id: number,
        public content: string,
        public rating: number,
        public publicationDate: Date,
        public lastUpdate: Date,
        public productId: number,
        public user: User) { }

}
