import { Country } from "./country.model";

export class Address {

    constructor(public id: number,
        public name: string,
        public street: string,
        public city: string,
        public zipcode: number,
        public country: Country,
        public isDefaultShipping?: boolean,
        public isDefaultBilling?: boolean) { }

}
