import { TestBed } from '@angular/core/testing';

import { DeliveryOptionService } from './delivery-option.service';

describe('DeliveryOptionService', () => {
  let service: DeliveryOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
