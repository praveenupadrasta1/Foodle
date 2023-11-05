import { TestBed } from '@angular/core/testing';

import { ApplyShippingBillingAddressService } from './apply-shipping-billing-address.service';

describe('ApplyShippingBillingAddressService', () => {
  let service: ApplyShippingBillingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyShippingBillingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
