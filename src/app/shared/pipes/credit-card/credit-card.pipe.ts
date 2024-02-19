import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCard'
})
export class CreditCardPipe implements PipeTransform {

  transform(creditCardNumber: number): string {

    if(creditCardNumber) {

      const maskedSection = creditCardNumber.toString().slice(-8, -4);
      const visibleSection = creditCardNumber.toString().slice(-4);

      return maskedSection.replace(/./g, '*') + '-' + visibleSection;

    }

    return '';

  }

}
