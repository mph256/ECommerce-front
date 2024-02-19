import { CreditCardPipe } from './credit-card.pipe';

describe('CreditCardPipePipe', () => {
  it('create an instance', () => {
    const pipe = new CreditCardPipe();
    expect(pipe).toBeTruthy();
  });
});
