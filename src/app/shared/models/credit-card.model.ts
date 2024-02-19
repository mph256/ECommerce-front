export class CreditCard {

    constructor(public id: number,
        public number: number,
        public holderName: string,
        public expirationDate: Date,
        public type: string,
        public isDefault?: boolean) { }

}
