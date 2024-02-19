import { User } from "./user.model";
import { Image } from "./image.model";
import { Category } from "./category.model";
import { Review } from "./review.model";

export class Product {

    constructor(public id: number,
        public name: string,
        public description: string,
        public countryOfOrigin: string,
        public manufacturer: string,
        public quantityAvailable: number,
        public price: number,
        public rating: number,
        public seller: User,
        public images: Image[],
        public categories: Category[],
        public dimensions?: string,
        public weight?: string,
        public reviews?: Review[]) { }

}
