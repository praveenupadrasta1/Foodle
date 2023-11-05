import { TestBed } from '@angular/core/testing';

import { GetShippingAddressesService } from './get-shipping-addresses.service';

describe('GetShippingAddressesService', () => {
  let service: GetShippingAddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetShippingAddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
